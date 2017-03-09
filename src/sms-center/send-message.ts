import * as debug from 'debug';
const log: debug.IDebugger = debug('psg:sms:sendmsg');

import l10n from '../share/l10n';
import {getTokenObj} from '../share/storage';
// import sendAlert from '../share/send-alert';

const sendSMS = {};
sendSMS['payam-resan'] = require('./payam-resan/send-message').sendMessage;

export default async function (token: string, to: string, text: string): Promise<any> {
  const tokenObj = getTokenObj(token);

  if (!tokenObj) {
    throw {code: 102};
  }

  if (!to || !text) {
    throw {code: 105};
  }

  const sendMessage: Function = sendSMS[tokenObj.panel];
  if (!sendMessage) {
    throw {code: 106, extra: tokenObj.panel};
  }

  const sendParameter = {
    username: tokenObj.username,
    password: tokenObj.password,
    from: tokenObj.phone,
    to: to,
    text: text
  };
  return sendMessage(sendParameter);
}
