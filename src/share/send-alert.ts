import l10n from '../share/l10n';
import {alertUrl as alertBaseUrl, alertToken} from './config';
const alertUrl: string = `${alertBaseUrl}/v2/sendMessage/${alertToken}`;
import request from './1request';

import * as debug from 'debug';
const log: debug.IDebugger = debug('psg:send-alert');

export default async function sendAlert (code: number, extra: any, file?: any) {
  log('sendAlert');
  log(code);

  if (!alertToken) {
    log('Alert token not found!');
    return;
  }

  const data: any = {
    title: 'SMS Getway Error!',
    id: `error_${code}`,
    description: l10n(`error_${code}`),
    extra: extra,
    sendAllContent: true,
    // parseMode: 'Markdown'
  };

  if (file) {
    data['file'] = file;
  }

  try {
    const resolute = await sendTelegramMessage(data);
    log(resolute.body);
    if (resolute.body && resolute.body.ok) {
      return resolute.body;
    }
    else {
      log('Error in sending alert!');
      log(resolute.response);
    }
  }
  catch (err) {
    log('Error in request');
    log(err);
  }
}

export async function sendTelegramMessage (data: any) {
  log('sendTelegramMessage');
  log(data);

  if (!alertToken) {
    throw('Alert token not found!');
  }

  const requestOption: any = {
    method: 'POST',
    url: alertUrl,
    headers: {
      'cache-control': 'no-cache',
      'content-type': 'application/json',
    },
    body: data,
    gzip: true,
    json: true,
  }

  return request(requestOption);
}
