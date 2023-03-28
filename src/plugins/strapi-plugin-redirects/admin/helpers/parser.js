'use strict';

const csvtojson = require('csvtojson');

const parseCSV = async (data) => {
  const dataRaw = await csvtojson().fromString(data);
  const redirects = dataRaw.map((item) => {
    let type;

    if (item.type === '301' || item.statusCode === '301') {
      type = 'permanent';
    }

    if (item.type === '302' || item.statusCode === '302') {
      type = 'temporary';
    }

    return {
      from: item.from,
      to: item.to,
      type,
      details: {
        type: 'NEW'
      }
    };
  });
  return redirects;
};

export default parseCSV;
