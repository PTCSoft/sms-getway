import l10n from '../share/l10n';
import {alertUrl as alertBaseUrl, alertToken} from './config';
const alertUrl: string = `${alertBaseUrl}/v2/sendMessage/${alertToken}`;

import * as debug from 'debug';
const log: debug.IDebugger = debug('send-alert');

export default async function sendAlert (code: number, extra: any, file?: any) {
  const data: any = {
    title: 'PTC Telegram Service Error!',
    id: `error_${code}`,
    description: l10n(`error_${code}`),
    extra: extra,
    sendAllContent: true,
    // parseMode: 'Markdown'
  };

  if (file) {
    data['file'] = file;
  }

  return await sendTelegramMessage(data);
}

export async function sendTelegramMessage (data: any) {
  log(data);
  if (!alertToken) {
    log('Alert token not found!');
    return;
  }


}
