import * as debug from 'debug';
const log: debug.IDebugger = debug('psg:sms:payamresan:sendmsg');

type sendParameter = {
  to:       string,
  from:     string,
  text:     string,
  password: string,
  username: string,
};

export async function sendMessage (parameter: sendParameter): Promise<any> {
  return 'eyval! ' + parameter.text;
}
