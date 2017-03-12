import {parseEnv, getBoolEnv} from './utill';

export const appName: string = parseEnv('$npm_package_name');
export const appDescription: string = parseEnv('$npm_package_description');
export const appVersion: string = parseEnv('$npm_package_version');

export const faviconUrl: string = parseEnv('$npm_package_config_faviconUrl');

export const storagePrefix: string = parseEnv('$PSG_STORAGE_PREFIX') || './storage/';

export const saveDelay: number = parseInt(parseEnv('$PSG_SAVE_DELAY')) || 15000;

export const port: number = parseInt(parseEnv('$PSG_SERVER_PORT')) || 8080;

export const host: string = parseEnv('$PSG_SERVER_HOST') || '0.0.0.0';

export const alertUrl: string = (function (): string {
  let url: string = parseEnv('$PSG_ALERT_URL') || 'http://telegram-alert.ptcvdep.net';
  if (url.substr(-1) === '/') {
    // remove end slash
    url = url.substr(0, url.length-1);
  }
  return url;
})();

export const alertToken: string = parseEnv('$PSG_ALERT_TOKEN');
