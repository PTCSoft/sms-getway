import './api/make-server';
import sendAlert from './share/send-alert';
import {version} from './share/config';

console.log(`SMS Getway v${version} Started.`);
sendAlert(1, {version: version});
