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
  from?:     string,
  username?: string,
  password?: string
};

export default async function (token: string, smsData: smsDataType): Promise<any> {
  const tokenObj = getTokenObj(token);

  if (!tokenObj) {
    throw {code: 102};
  }

  const sendMessage: Function = sendSMS[tokenObj.panel];
  if (!sendMessage) {
    throw {code: 106, extra: tokenObj.panel};
  }

  const sendParameter = {
    to:       smsData.to,
    text:     smsData.text,
    from:     smsData.from     || tokenObj.from,
    username: smsData.username || tokenObj.username,
    password: smsData.password || tokenObj.password,
  };

  if (!(sendParameter.to && sendParameter.text && sendParameter.from && sendParameter.username && sendParameter.password)) {
    throw {code: 105};
  }

  return sendMessage(sendParameter);
}
