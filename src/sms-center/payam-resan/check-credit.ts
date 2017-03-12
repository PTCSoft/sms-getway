import request from '../../share/1request';
import * as debug from 'debug';
const log: debug.IDebugger = debug('psg:sms:payamresan:credit');

export const url = "http://www.payam-resan.com/Credit.aspx";

type checkParameter = {
  password: string,
  username: string,
};

export async function checkCredit (parameter: checkParameter): Promise<any> {
  log('checkCredit');

  const requestOption: any = {
    method: 'POST',
    url: url,
    headers: {
      'cache-control': 'no-cache',
      'content-type': 'multipart/form-data',
    },
    formData:  {
      Username: parameter.username,
      Password: parameter.password
    }
  }

  log(requestOption);

  const resolute = await request(requestOption);

  const body = resolute.body ? resolute.body.trim() : null;
  log('body:', body);

  if (body && body.length > 1) {
    return body;
  }
  else {
    throw {code: 107, extra: body};
  }
}
