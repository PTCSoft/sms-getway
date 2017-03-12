import * as debug from 'debug';
const log: debug.IDebugger = debug('psg:sms:credit');

import l10n from '../share/l10n';
import {getTokenObj} from '../share/storage';
// import sendAlert from '../share/send-alert';

const checkCreditFn = {};
checkCreditFn['payam-resan'] = require('./payam-resan/check-credit').checkCredit;

export default async function (token: string): Promise<any> {
  log('sms check credit');

  const tokenObj = getTokenObj(token);

  if (!tokenObj) {
    throw {code: 102};
  }

  const checkCredit: Function = checkCreditFn[tokenObj.panel];
  if (!checkCredit) {
    throw {code: 106, extra: tokenObj.panel};
  }

  const parameter = {
    username: tokenObj.username,
    password: tokenObj.password
  };
  return checkCredit(parameter);
}
