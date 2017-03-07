import * as debug from 'debug';
const log: debug.IDebugger = debug('pts:server:sendmsg');

import {IncomingMessage} from 'http';
import l10n from '../share/l10n';
import sendMessage from '../bot/send-message';
import sendError from '../bot/send-error';
import {getPostData, getClientAddress} from '../share/utill';

export const urlRegExp: RegExp = new RegExp('^/(v2/)?(sendMessage|log)/(\\w*)/?$');
export default async function commandSendMessage (request:IncomingMessage): Promise<any> {
  log('commandSendMessage');

  // extract tokenId from url
  let
   tokenId: string   = '',
  _tokenId: string[] = urlRegExp.exec(request.url),
  sendLog: boolean = false
  ;
  if(_tokenId && _tokenId.length === 4) {
    tokenId = _tokenId[3];
    if (_tokenId[1] === 'log') {
      sendLog = true;
    }
  } else {
    sendError(101, {
      requestTokenId: tokenId,
      url: request.url
    });
    return {
      ok: false,
      error_code: 101
    };
  }

  // Only POST is valid
  if (request.method !== 'POST') {
    sendError(100, {
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
    sendError(103, null, postData);
    return {
      ok: false,
      error_code: 103,
      postData: postData
    };
  }

  if (!data['request-ip']) {
    data['request-ip'] = getClientAddress(request);
  }

  if (sendLog && data['sendAllContent'] === undefined) {
    data['sendAllContent'] = true;
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
