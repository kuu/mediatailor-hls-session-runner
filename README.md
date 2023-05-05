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
Make sure that the url includes both prefix and suffix
```
$ npm run session -- --dry-run {{MediaTailor Session Initialozation URL}}
```

### Run HLS session
Keeps downloading the child manifest until being stopped by `[Ctrl]-[C]`
```
$ npm run session {{MediaTailor Session Initialozation URL}}
```

### Run HLS session (with the debug mode)
```
$ npm run session {{MediaTailor Session Initialozation URL}} -- --debug
```

### Run HLS session (with stream ID)
Stream ID is used for prefetch
```
$ npm run session {{MediaTailor Session Initialozation URL}} -- --stream-id group-A
```

### Run HLS session (with dynamic variables)
Dynamic variables need to be appended to the end (cannot come before other options)
```
$ npm run session {{MediaTailor Session Initialozation URL}} param1 value1 param2 value2
```

### Run HLS session as an external process
```
$ npm start {{MediaTailor Session Initialozation URL}}
```

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
