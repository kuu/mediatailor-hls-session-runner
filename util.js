import {URL} from 'node:url';

export function formatDate(dt) {
  const y = dt.getUTCFullYear();
  const m = `00${dt.getUTCMonth() + 1}`.slice(-2);
  const d = `00${dt.getUTCDate()}`.slice(-2);
  const h = `00${dt.getUTCHours()}`.slice(-2);
  const min = `00${dt.getUTCMinutes()}`.slice(-2);
  const sec = `00${dt.getUTCSeconds()}`.slice(-2);
  const msec = `000${dt.getUTCMilliseconds()}`.slice(-3);
  return `${y}-${m}-${d}T${h}:${min}:${sec}.${msec}Z`;
}

export function createUrlObject(url) {
  let obj = null;
  try {
    obj = new URL(url);
  } catch {
    return null;
  }
  return obj;
}

export function getParams(argv) {
  const obj = {};
  while (argv[0]) {
    const key = argv.shift();
    const value = argv.shift();
    if (value === undefined) {
      break;
    }
    obj[key] = value;
  }
  return obj;
}

export function filterArgs(argv) {
  const args = {
    sessionInitUrl: '',
    dryRun: false,
    useScenario: false,
    sessionParams: {
      streamId: '',
      adsParams: null,
      logMode: '',
    },
  };

  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--dry-run') {
      args.dryRun = true;
    } else if (argv[i] === '--debug') {
      args.sessionParams.logMode = 'DEBUG';
    } else if (argv[i] === '--stream-id') {
      args.sessionParams.streamId = argv[++i];
    } else if (argv[i] === '--use-scenario') {
      args.useScenario = true;
    } else if (args.sessionInitUrl) {
      args.sessionParams.adsParams = getParams(argv.slice(i));
      break;
    } else {
      args.sessionInitUrl = argv[i];
    }
  }
  if (args.sessionParams.streamId === '') {
    delete args.sessionParams.streamId;
  }
  if (args.sessionParams.adsParams === null) {
    delete args.sessionParams.adsParams;
  }
  if (args.sessionParams.logMode === '') {
    delete args.sessionParams.logMode;
  }
  return args;
}
