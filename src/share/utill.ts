import * as debug from 'debug';
const log: debug.IDebugger = debug('psg:utill');

import {IncomingMessage} from 'http';

/**
 * Parse str and replace all $name with process.env.name and repeat twice becaouse process.env.name can have $another-name
 * @export parseEnv
 * @param {string} str  Target string value contain $
 * @return {string}    Parsed string
 *
 * @example
 *  let name = parseEnv('$USER_NAME');
 *  let msg = parseEnv('Hello $USER_NAME');
 */
export function parseEnv (str: string): string {
  log(`parseEnv: ${str}`);
  return _parseEnv(_parseEnv(str));
}

const $enviromentPatern = /\$([^/$]+)/g;
/**
 * Parse str and replace all $name with process.env.name
 * @param {string} str  Target string value contain $
 * @return {string}    Parsed string
 */
function _parseEnv (str: string): string {
  log(`parseEnv: ${str}`);
  return str.replace($enviromentPatern, (_, n) => {
    return process.env[n] || '';
  });
}

/**
 * Get boolean config from process.env
 * @export
 * @param {string} str   Target string value start with $
 * @param {boolean} def  Default value if target env not found or not have a boolean value
 * @return {boolean}
 *
 * @example
 *   let autoUpdate = getBoolEnv('$APP_AUTO_AUPDATE', true);
 */
export function getBoolEnv (str: string, def: boolean = false): boolean {
  log(`getBoolEnv: ${str}`);
  const value: string = parseEnv(str).trim().toLowerCase();
  if (value === 'true') {
    return true;
  }
  else if (value === 'false') {
    return false;
  }
  else {
    return def;
  }
}


import xpath = require('path');
import fs = require('fs');
const _0777: number = parseInt('0777', 8);

export function mkdirSync (path: string, mode: number = _0777) {
  log(`mkdirSync: ${path}`);
  path = xpath.resolve(path);
  try {
    fs.mkdirSync(path, mode);
  }
  catch (err) {
    if (err.code === 'ENOENT') {
      mkdirSync(xpath.dirname(path), mode);
      return mkdirSync(path, mode);
    }

    if (!fs.statSync(path).isDirectory()) throw err;
  }
}

/**
 * Hash string for fast crc checking (not encrypting).
 * @export
 * @param {string} string
 * @param {string} length
 * @return {string}
 * @example
 *   ley hashKey: string = hashString(key);
 */
export function hashString (string: string, length: number): string {
  log('hashString', {string: string, length: length});

  let i: number, hash: number = 0;
  for (i = 0; i<string.length; i++){
    hash += string.charCodeAt(i) * 1.2;
  }
  let hashStr: string = Math.floor(hash).toString(36);

  for (i=hashStr.length; i<length; i++){
    hashStr='0'+hashStr;
  }
  return hashStr.substr(0, length);
}

export function getClientAddress (request: IncomingMessage) {
  log('getClientAddress');

  return (request.headers['x-forwarded-for'] || '').split(',')[0] || request.connection.remoteAddress;
};

/**
 * Extract post data from http request
 */
export async function getPostData (request: IncomingMessage): Promise<any> {
  log('getPostData');

  return new Promise(function (resolve: Function) {
    let data: string = '';
    request.on('data', (_data) => {
      data += _data;
    });

    const timer: NodeJS.Timer = setTimeout(() => {
      resolve(data);
    }, 3000);

    request.on('end', (_data) => {
      clearTimeout(timer);
      resolve(data);
    });
  });
}
