import {parseEnv, getBoolEnv} from './utill';

export const version: string = parseEnv('$npm_package_version') || '0.0.0';

export const storagePrefix: string = parseEnv('$PSG_STORAGE_PREFIX') || './storage/';

export const saveDelay: number = parseInt(parseEnv('$PSG_SAVE_DELAY')) || 15000;

export const port: number = parseInt(parseEnv('$PSG_SERVER_PORT')) || 8080;

export const host: string = parseEnv('$PSG_SERVER_HOST') || '0.0.0.0';

export const alertUrl: string = (function (): string {
  let url: string = parseEnv('$PSG_ALERT_URL') || 'http://alert.ptcvdep.com';
  if (url.substr(-1) === '/') {
    // remove end slash
    url = url.substr(0, url.length-1);
  }
  return url;
})();

export const alertToken: string = parseEnv('$PSG_ALERT_TOKEN');
