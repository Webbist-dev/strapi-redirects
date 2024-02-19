'use strict';

const csvtojson = require('csvtojson');

const typeMappings = {
  '301': 'moved_permanently_301',
  '302': 'found_302',
  '307': 'temporary_redirect_307',
  '410': 'gone_410',
  '451': 'unavailable_for_legal_reasons_451',
};

// Helper function to detect immediate loops
const isImmediateLoop = (from, to) => from === to;

// Helper function to detect duplicates within the CSV
const findDuplicate = (redirects, from) => redirects.find(r => r.from === from);

// Updated helper function to detect indirect loops more accurately
const isIndirectLoop = (redirects, from, to, origin = from, checked = new Set()) => {
  // Prevent infinite recursion by checking if we've already inspected this URL
  if (checked.has(to)) return false;
  checked.add(to);

  for (const redirect of redirects) {
    if (redirect.from === to) {
      // If the "to" URL redirects back to the origin, a loop is detected
      if (redirect.to === origin) return true;
      // Recursively check the next link in the chain
      if (isIndirectLoop(redirects, redirect.from, redirect.to, origin, checked)) return true;
    }
  }
  return false;
};

const parseAndValidateCSV = async (data) => {
  try {
    const dataRaw = await csvtojson().fromString(data);
    const redirects = dataRaw.map(item => ({
      from: item.from,
      to: item.to,
      type: typeMappings[item.type] || 'moved_permanently_301',
    }));

    const validationResults = redirects.map((redirect, index, self) => {
      if (isImmediateLoop(redirect.from, redirect.to)) {
        return { ...redirect, status: 'INVALID', reason: 'Immediate loop detected', details: { type: 'LOOP_DETECTED' } };
      }

      // Adjusted to ensure we don't mark the first occurrence as a duplicate
      if (findDuplicate(self.slice(0, index), redirect.from)) {
        return { ...redirect, status: 'INVALID', reason: 'Duplicate redirect', details: { type: 'DUPLICATE' } };
      }

      // Check for indirect loops without including the current redirect in the check
      if (isIndirectLoop(self.filter((_, idx) => idx !== index), redirect.from, redirect.to)) {
        return { ...redirect, status: 'INVALID', reason: 'Indirect loop detected', details: { type: 'LOOP_DETECTED' } };
      }

      return { ...redirect, status: 'VALID', details: { type: 'NEW' } };
    });
    return validationResults;
  } catch (error) {
    console.error('Failed to parse CSV:', error);
    throw new Error('Error parsing and validating CSV data');
  }
};

module.exports = parseAndValidateCSV;