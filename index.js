#!/usr/bin/env node

import process from 'node:process';
import fetch from 'node-fetch';
import hlx from 'hlx-lib';
import {SessionRunner} from './runner.js';
import {formatDate, createUrlObject, filterArgs} from './util.js';

const args = filterArgs(process.argv.slice(2));

const urlObj = createUrlObject(args.sessionInitUrl);

if (!urlObj) {
  throw new Error(`Invalid session initialization URL: ${args.sessionInitUrl}`);
}

const body = JSON.stringify(args.sessionParams, null, 0);

console.log(`--- ${formatDate(new Date())} ---`);
console.log(`Session URL: ${args.sessionInitUrl}`);
console.log('Session params:');
console.log(`${body}`);

try {
  // Initialize a session
  const res = await fetch(args.sessionInitUrl, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body,
  });
  const {manifestUrl} = await res.json();
  const url = `${urlObj.origin}${manifestUrl}`;

  if (args.dryRun) {
    // Display the HLS url
    console.log(url);
  } else {
    // Start playback of the HLS url
    const urlObj = createUrlObject(url);
    console.log(`SessionID: ${urlObj.searchParams.get('aws.sessionId')}`);
    playHls(url);
  }
} catch (err) {
  console.error(err.stack);
}

function playHls(url) {
  hlx.src(url, {playlistOnly: true, noUriConversion: true})
    .pipe(new SessionRunner(url))
    .pipe(hlx.dest())
    .on('error', err => {
      throw err;
    });
}
