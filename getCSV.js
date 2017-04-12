'use strict';

const fs = require('fs');
const https = require('https');
const url = require('url');
const csv = require('fast-csv');
const format = require('dateformat');

const config = require('./config');
const start = '2016-10-01';
const end = '2016-10-31';
const project = 23626991;
const startDate = (new Date(start)).toISOString();
const endDate = (new Date(end)).toISOString();

const location = url.parse('https://toggl.com/api/v8/time_entries');
location.query = {
  start_date: startDate,
  end_date: endDate,
  pid: project
};

const options = {
  hostname: 'toggl.com',
  path: location.format(),
  method: 'GET',
  headers: {
    'Authorization': config.AUTHORIZATION_HEADER
  }
};
const req = https.request(options, function(res) {
  res.on('data', function(d) {
    genCSV(JSON.parse(d.toString()));
  });
});
req.end();

function genCSV(entries) {
  const stream = csv.createWriteStream({headers: true});
  const writable = fs.createWriteStream('toggl-entries--pid-' + project + '--' + start + '-to-' + end + '.csv');
  stream.pipe(writable);
  for(let i = 0; i < entries.length; i++) {
    stream.write({
      Date: format(new Date(entries[i].start), 'yyyy-mm-dd'),
      Start: format(new Date(entries[i].start), 'h:MM:ss TT'),
      End: format(new Date(entries[i].stop), 'h:MM:ss TT'),
      Total: formatSeconds(entries[i].duration)
    });
  }
  stream.end();
}

function formatSeconds(seconds) {
  function pad2(val) {
    return ('0' + val).slice(-2);
  }
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = (seconds % 3600) % 60;
  return pad2(hrs) + ':' + pad2(mins) + ':' + pad2(secs);
}

