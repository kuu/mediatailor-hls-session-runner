import process from 'node:process';
import {readFile} from 'node:fs/promises';
import {createUrlObject, filterArgs} from './util.js';
import {runSession} from './session.js';

const args = filterArgs(process.argv.slice(2));
const urlObj = createUrlObject(args.sessionInitUrl);
if (!urlObj) {
  throw new Error(`Invalid session initialization URL: ${args.sessionInitUrl}`);
}

if (args.useScenario) {
  let scenario = [];
  try {
    scenario = JSON.parse(await readFile('./scenario.json'));
  } catch {
    console.error('Test scenario file (scenario.json) is required when --use-scenario is specified.');
  }
  for (const item of scenario) {
    await delayedRunSession(urlObj, Object.assign({...args}, item), 100);
  }
} else {
  runSession(urlObj, args);
}

function delayedRunSession(urlObj, args, ms) {
  return new Promise(resolve => {
    setTimeout(() => {
      runSession(urlObj, args);
      resolve();
    }, ms);
  });
}
