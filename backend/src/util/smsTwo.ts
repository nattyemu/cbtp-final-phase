// import { Vonage } from '@vonage/server-sdk';
// import { VONAGE_API, VONAGE_APISECRAT } from '../config/secrets.js';

// const vonage = new Vonage({
//   apiKey: VONAGE_API,
//   apiSecret: VONAGE_APISECRAT
// })

// const from = "Vonage APIs";

// async function sendSMS22(to:string,text:string) {
//    await vonage.sms.send({to, from, text})
//        .then(resp => { console.log('Message sent successfully'); console.log(resp); })
//        .catch(err => { console.log('There was an error sending the messages.'); console.error(err); });
// }
// export default sendSMS22;