import {Transform} from 'node:stream';
import {formatDate} from './util.js';

function printPlaylist(uri, source) {
  console.log('==========');
  console.log(`${formatDate(new Date())}`);
  console.log(`Url: ${uri}`);
  console.log('----------');
  console.log(`${source}`);
}

export class SessionRunner extends Transform {
  constructor() {
    super({objectMode: true});
    this.avails = new Set();
  }

  checkPlaylist({uri, source, segments}) {
    for (const {dateRange} of segments) {
      if (dateRange && dateRange.duration && !this.avails.has(dateRange.id)) {
        // Print when a new ad-marker found
        printPlaylist(uri, source);
        this.avails.add(dateRange.id);
      }
    }
  }

  _transform(data, _, cb) {
    // Only check the highest bitrate playlist
    if (data.type === 'playlist' && !data.isMasterPlaylist && data.uri.endsWith('0.m3u8')) {
      this.checkPlaylist(data);
      console.log(`Playlist checked: ${data.uri}`);
    }
    cb(null, data);
  }
}
