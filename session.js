import fetch from 'node-fetch';
import hlx from 'hlx-lib';
import {SessionRunner} from './runner.js';
import {formatDate, createUrlObject, appendQueryStrings} from './util.js';

export async function runSession(urlObj, {dryRun, sessionInitUrl, sessionParams, shift}) {
  if (shift > 0) {
    const end = Math.floor(Date.now() / 1000);
    const start = end - shift;
    sessionInitUrl = appendQueryStrings(sessionInitUrl, {start, end});
  }

  const body = JSON.stringify(sessionParams, null, 0);

  console.log(`--- ${formatDate(new Date())} ---`);
  console.log(`Session URL: ${sessionInitUrl}`);
  console.log('Session params:');
  console.log(`${body}`);

  try {
    // Initialize a session
    const res = await fetch(sessionInitUrl, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body,
    });
    const {manifestUrl} = await res.json();
    const url = `${urlObj.origin}${manifestUrl}`;

    if (dryRun) {
      // Display the HLS url
      console.log('HLS endpoiint URL:');
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
}

function playHls(url) {
  hlx.src(url, {playlistOnly: true, noUriConversion: true})
    .pipe(new SessionRunner(url))
    .pipe(hlx.dest())
    .on('error', err => {
      throw err;
    });
}
