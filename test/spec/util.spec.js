import test from 'ava';
import {formatDate, createUrlObject, getParams, filterArgs, appendQueryStrings} from '../../util.js';

test('utils.formatDate', t => {
  const DATE = '2014-03-05T11:15:00.000Z';
  t.is(formatDate(new Date(DATE)), DATE);
  const LOCALDATE = '2000-01-01T08:59:59.999+09:00';
  const UTC = '1999-12-31T23:59:59.999Z';
  t.is(formatDate(new Date(LOCALDATE)), UTC);
});

test('utils.createUrlObject', t => {
  const URL = 'http://example.com/path/to/file.html';
  t.truthy(createUrlObject(URL));
  const nonURL = 'Bugus URL';
  t.falsy(createUrlObject(nonURL));
});

test('utils.getParams', t => {
  const params = ['foo', '123', 'bar', '456', 'baz', '789'];
  const obj = {foo: '123', bar: '456', baz: '789'};
  t.deepEqual(getParams(params), obj);
  const extraParams = ['foo', '123', 'bar', '456', 'baz', '789', 'extra'];
  t.deepEqual(getParams(extraParams), obj);
});

test('utils.filterArgs', t => {
  const args = {
    sessionInitUrl: '',
    dryRun: false,
    useScenario: false,
    shift: 0,
    sessionParams: {},
  };

  const sessionInitUrl = 'http://example.com/session/init';
  let argv = [sessionInitUrl];
  t.deepEqual(filterArgs(argv), Object.assign({...args}, {sessionInitUrl}));
  argv = ['--dry-run', 'http://example.com/session/init'];
  t.deepEqual(filterArgs(argv), Object.assign({...args}, {sessionInitUrl, dryRun: true}));
  argv = ['--use-scenario', 'http://example.com/session/init'];
  t.deepEqual(filterArgs(argv), Object.assign({...args}, {sessionInitUrl, useScenario: true}));
  argv = ['--stream-id', 'group-1', 'http://example.com/session/init'];
  t.deepEqual(filterArgs(argv), Object.assign({...args}, {sessionInitUrl, sessionParams: {streamId: 'group-1'}}));
  argv = ['--dry-run', '--stream-id', 'group-1', 'http://example.com/session/init'];
  t.deepEqual(filterArgs(argv), Object.assign({...args}, {sessionInitUrl, dryRun: true, sessionParams: {streamId: 'group-1'}}));
  argv = ['--stream-id', 'group-1', '--dry-run', 'http://example.com/session/init'];
  t.deepEqual(filterArgs(argv), Object.assign({...args}, {sessionInitUrl, dryRun: true, sessionParams: {streamId: 'group-1'}}));
  argv = ['http://example.com/session/init', '--dry-run', '--stream-id', 'group-1'];
  t.deepEqual(filterArgs(argv), Object.assign({...args}, {sessionInitUrl, dryRun: true, sessionParams: {streamId: 'group-1'}}));
  argv = ['http://example.com/session/init', '--stream-id', 'group-1', '--dry-run'];
  t.deepEqual(filterArgs(argv), Object.assign({...args}, {sessionInitUrl, dryRun: true, sessionParams: {streamId: 'group-1'}}));
  argv = ['--dry-run', 'http://example.com/session/init', '--stream-id', 'group-1'];
  t.deepEqual(filterArgs(argv), Object.assign({...args}, {sessionInitUrl, dryRun: true, sessionParams: {streamId: 'group-1'}}));
  argv = ['--stream-id', 'group-1', 'http://example.com/session/init', '--dry-run'];
  t.deepEqual(filterArgs(argv), Object.assign({...args}, {sessionInitUrl, dryRun: true, sessionParams: {streamId: 'group-1'}}));
  argv = ['--dry-run', 'http://example.com/session/init', '--debug', '--stream-id', 'group-1'];
  t.deepEqual(filterArgs(argv), Object.assign({...args}, {sessionInitUrl, dryRun: true, sessionParams: {streamId: 'group-1', logMode: 'DEBUG'}}));
  argv = ['--dry-run', '--stream-id', 'group-1', 'http://example.com/session/init', 'bar', '456', 'baz', '789'];
  t.deepEqual(filterArgs(argv), Object.assign({...args}, {sessionInitUrl, dryRun: true, sessionParams: {streamId: 'group-1', adsParams: {bar: '456', baz: '789'}}}));
  argv = ['http://example.com/session/init', '--shift', 300];
  t.deepEqual(filterArgs(argv), Object.assign({...args}, {sessionInitUrl, shift: 300, dryRun: true}));
  try {
    filterArgs([]);
  } catch {
    t.pass();
  }
});

test('utils.appendQueryStrings', t => {
  const url = 'https://example.com';
  const query = {abc: 123, def: 456};
  t.is(appendQueryStrings(url, query), `${url}/?abc=123&def=456`);
  t.is(appendQueryStrings(`${url}/path/to/file`, query), `${url}/path/to/file?abc=123&def=456`);
  t.is(appendQueryStrings(`${url}/path/to/file?ghi=789`, query), `${url}/path/to/file?ghi=789&abc=123&def=456`);
});
