import {alertUrl as alertBaseUrl, alertToken} from './config';
const alertUrl: string = `${alertBaseUrl}/v2/sendMessage/${alertToken}`;
