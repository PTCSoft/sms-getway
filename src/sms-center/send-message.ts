import * as debug from 'debug';
const log: debug.IDebugger = debug('psg:sms:sendmsg');

import l10n from '../share/l10n';
import {getTokenObj} from '../share/storage';
// import sendAlert from '../share/send-alert';

const sendSMS = {};
sendSMS['payam-resan'] = require('./payam-resan/send-message').sendMessage;

export type smsDataType = {
  to:        string,
  text:      string,
  username?: string,
  password?: string
};

export default async function (token: string, smsData: smsDataType): Promise<any> {
  const tokenObj = getTokenObj(token);

  if (!tokenObj) {
    throw {code: 102};
  }

  if (!smsData.to || !smsData.text) {
    throw {code: 105};
  }

  const sendMessage: Function = sendSMS[tokenObj.panel];
  if (!sendMessage) {
    throw {code: 106, extra: tokenObj.panel};
  }

  const sendParameter = {
    username: smsData.username || tokenObj.username,
    password: smsData.password || tokenObj.password,
    from: tokenObj.from,
    to: smsData.to,
    text: smsData.text,
  };
  return sendMessage(sendParameter);
}
