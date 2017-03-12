import './api/make-server';
import sendAlert from './share/send-alert';
import {appVersion} from './share/config';

console.log(`SMS Getway v${appVersion} Started.`);
sendAlert(1, {version: appVersion});
