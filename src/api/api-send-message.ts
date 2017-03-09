import * as debug from 'debug';
const log: debug.IDebugger = debug('pts:server:sendmsg');

import {IncomingMessage} from 'http';
import l10n from '../share/l10n';
import sendAlert from '../share/send-alert';
import {getPostData, getClientAddress} from '../share/utill';
import sendMesaage from '../sms-center/send-message';

export const urlRegExp: RegExp = new RegExp('^/v1/sendMessage/(\\w*)/?$');
export default async function commandSendMessage (request:IncomingMessage): Promise<any> {
  log('commandSendMessage');

  // extract tokenId from url

  const _token: string[] = urlRegExp.exec(request.url);

  if (!_token || _token.length !== 2) {
    sendAlert(101, {
      url: request.url
    });
    return {
      ok: false,
      error_code: 101
    };
  }

  const token: string = _token[1];

  // Only POST is valid
  if (request.method !== 'POST') {
    sendAlert(100, {
      method: request.method,
      url: request.url
    });
    return {
      ok: false,
      error_code: 100
    };
  }

  const postData: string = await getPostData(request);
  let data: Object;
  try {
    data = JSON.parse(postData);
  }
  catch (err) {
    sendAlert(103, null, postData);
    return {
      ok: false,
      error_code: 103,
      postData: postData
    };
  }

  if (!data['request-ip']) {
    data['request-ip'] = getClientAddress(request);
  }

  try {
    const resolute = await sendMesaage(token, data);
    return {
      ok: true,
      resolute: resolute
    }
  }
  catch (errorCode) {
    sendAlert(errorCode, {
      token: token,
      data: data
    });
    return {
      ok: false,
      error_code: errorCode
    }
  }













  let errorCode: number;

  errorCode = sendMessage(tokenId, data);
  log('sent, error code: ' + errorCode);

  if (!errorCode) {
    return {
      ok: true
    };
  }

  // else if errorCode
  log('sendMessage error: ' + errorCode);
  const returnObject: any = {
    ok: false,
    error_code: errorCode
  }

  if (errorCode === 102) {
    if (sendLog) {
      sendError(102);
    }
    return {
      ok: true,
      warning: l10n('error_102')
    }
  }

  //else if errorCode != 102
  sendError(errorCode);
  return returnObject;
}
