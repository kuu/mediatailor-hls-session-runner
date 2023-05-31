# mediatailor-hls-session-runner
A CLI for initializing HLS playback sessions for AWS Elemental MediaTailor client-side tracking

## Install
```
$ git clone https://github.com/kuu/mediatailor-hls-session-runner.git
$ cd mediatailor-hls-session-runner
$ npm install
```

## Usage

### Get HLS endpoint URL
```
$ npm run session -- --dry-run {{MediaTailor Session Initialozation URL}}
```
* `{MediaTailor Session Initialozation URL}` should be a prefix + manifest path e.g.: `https://xxx.mediatailor.ap-northeast-1.amazonaws.com/v1/session/xxx/config-name/path/to/manifest.m3u8`
* It returns an HLS endpoint URL that can be used for playing back with Safari, etc.

### Run HLS session
```
$ npm run session {{MediaTailor Session Initialozation URL}}
```
* Session ID is found in the output
* To keep the session's state active, it constantly downloads the child manifest until being stopped by `[Ctrl]-[C]`

### Run HLS session (with the debug mode)
```
$ npm run session {{MediaTailor Session Initialozation URL}} -- --debug
```
* It enables the [debug log](https://docs.aws.amazon.com/mediatailor/latest/ug/debug-log-mode.html) with the session

### Run HLS session (with stream ID)
```
$ npm run session {{MediaTailor Session Initialozation URL}} -- --stream-id group-A
```
* Stream ID is used for [prefetch](https://docs.aws.amazon.com/mediatailor/latest/ug/prefetching-ads.html)

### Run HLS session (with dynamic variables)
```
$ npm run session {{MediaTailor Session Initialozation URL}} param1 value1 param2 value2
```
* [Dynamic variables](https://docs.aws.amazon.com/mediatailor/latest/ug/variables.html) cannot come before other options.

### Get HLS endpoint URL for time-shifted viewing
This will add start/end query parameters to the session initialization URL with the following values:
* start: Time (seconds) specified with `--shift` parameter before the current time
* end: Current time
```
$ npm run session {{MediaTailor Session Initialozation URL}} -- --shift 300
```
* The above command appends query strings `start={5 minutes before}&end={current time}`
* `--dry-run` parameter will be added internally when `--shift` is specified.

### Run HLS session (with params described in a JSON file)
```
$ npm run session {{MediaTailor Session Initialozation URL}} -- --use-scenario
```
* Stream ID and dynamic variables need to be stored in `./scenario.json` as an array. Below is an example:
```
[
  {"streamId": "group-1", "adsParams": {"device_type": "mobile"}},
  {"streamId": "group-1", "adsParams": {"device_type": "tv"}},
  {"streamId": "group-2", "adsParams": {"device_type": "mobile"}},
  {"streamId": "group-2", "adsParams": {"device_type": "tv"}},
  {"streamId": "group-3", "adsParams": {"device_type": "mobile"}},
  {"streamId": "group-3", "adsParams": {"device_type": "tv"}}
]
```
* `--use-scenario` cannot be used with other options except for `--dry-run`

### Run HLS session as an external process
```
$ npm start {{MediaTailor Session Initialozation URL}}
```
* It spawns a separate process that can be inspected/terminated by the following commands.

### Check the process's status
```
$ npm run status
```

### Check the process's logs
```
$ npm run logs
```

### Stop the process
```
$ npm stop
```

### Delete the process's logs
```
$ npm run reset
```
