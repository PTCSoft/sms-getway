import request from '../../share/1request';
import * as debug from 'debug';
const log: debug.IDebugger = debug('psg:sms:payamresan:sendmsg');

export const url = "http://www.payam-resan.com/APISend.aspx";

type sendParameter = {
  to:       string,
  from:     string,
  text:     string,
  password: string,
  username: string,
};

export async function sendMessage (parameter: sendParameter): Promise<any> {
  const requestOption: any = {
    method: 'POST',
    url: url,
    headers: {
      'cache-control': 'no-cache',
      'content-type': 'multipart/form-data',
    },
    formData:  {
      Username: parameter.username,
      Password: parameter.password,
      From: parameter.from,
      To: parameter.to,
      Text: parameter.text
    }
  }

  log(requestOption)

  const resolute = await request(requestOption);

  const body = resolute.body ? resolute.body.trim() : null;

  if (body === '1' ) {
    return true;
  }

  else if (body === '0') {
    return false;
  }

  else {
    throw {code: 107, extra: body};
  }
}
