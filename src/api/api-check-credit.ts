import * as debug from 'debug';
const log: debug.IDebugger = debug('psg:api:checkcrd');

import {IncomingMessage} from 'http';
import l10n from '../share/l10n';
import sendAlert from '../share/send-alert';
import {getPostData, getClientAddress} from '../share/utill';
import checkCredit from '../sms-center/check-credit';

export const urlRegExp: RegExp = new RegExp('^/v1/checkCredit/(\\w*)/?$');
export default async function commandCheckCredit (request:IncomingMessage): Promise<any> {
  log('commandCheckCredit');

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

  try {
    const resolute = await checkCredit(token);
    if (resolute === false) {
      sendAlert(110, {
        token: token,
        requestIp: requestIp
      });
    }
    return {
      ok: true,
      resolute: resolute
    }
  }
  catch (err) {
    log('Error:', err);
    if (typeof err.code === 'number') {
      sendAlert(err.code, {
        token: token,
        requestIp: requestIp,
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
