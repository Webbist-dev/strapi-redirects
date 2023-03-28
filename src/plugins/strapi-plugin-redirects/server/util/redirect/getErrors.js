const getErrors = (duplicateError, loopingUrl) => {
  if (duplicateError) {
    return {
      message: "Duplicate redirect. Redirect with the same 'From' field already exists.",
      details: { type: 'DUPLICATE' }
    };
  }

  if (loopingUrl) {
    return {
      message: "Redirect will cause a loop. The given 'To' field will eventually loop back to the 'From' field.",
      details: { type: 'LOOP' }
    };
  }

  return undefined;
};

module.exports = { getErrors };
