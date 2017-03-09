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

  const requestIp = getClientAddress(request);

  const _token: string[] = urlRegExp.exec(request.url);

  if (!_token || _token.length !== 2 || _token[1].length === 0) {
    sendAlert(101, {
      url: request.url,
      requestIp: requestIp
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
      url: request.url,
      requestIp: requestIp
    });
    return {
      ok: false,
      error_code: 100
    };
  }

  const postData: string = await getPostData(request);
  let data: {
    to: string,
    text: string
  };
  try {
    data = JSON.parse(postData);
  }
  catch (err) {
    sendAlert(103, {
      requestIp: requestIp
    }, postData);
    return {
      ok: false,
      error_code: 103,
      postData: postData
    };
  }

  try {
    const resolute = await sendMesaage(token, data.to, data.text);
    return {
      ok: true,
      resolute: resolute
    }
  }
  catch (err) {
    if (err.code) {
      sendAlert(err.code, {
        token: token,
        requestIp: requestIp,
        data: data,
        extra: err.extra
      });
      const ret: any = {
        ok: false,
        error_code: err.code
      };
      if (err.extra) ret.extra = err.extra;
      return ret;
    }

    else {
      sendAlert(104, {
        token: token,
        data: data,
        requestIp: requestIp,
        error: err.toString ? err.toString() : err,
        stack: err.stack
      });
      return {
        ok: false,
        error_code: 104
      }
    }
  }
}
