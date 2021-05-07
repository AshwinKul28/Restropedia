/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 */

 'use strict';

 // Messenger API integration example
 // We assume you have:
 // * a Wit.ai bot setup (https://wit.ai/docs/quickstart)
 // * a Messenger Platform setup (https://developers.facebook.com/docs/messenger-platform/quickstart)
 // You need to `npm install` the following dependencies: body-parser, express, node-fetch.
 //
 // 1. npm install body-parser express node-fetch
 // 2. Download and install ngrok from https://ngrok.com/download
 // 3. ./ngrok http 8445
 // 4. WIT_TOKEN=your_access_token FB_APP_SECRET=your_app_secret FB_PAGE_TOKEN=your_page_token node examples/messenger.js
 // 5. Subscribe your page to the Webhooks using verify_token and `https://<your_ngrok_io>/webhook` as callback URL.
 // 6. Talk to your bot on Messenger!
 const { wordsToNumbers } = require('words-to-numbers');
 const bodyParser = require('body-parser');
const { SSL_OP_EPHEMERAL_RSA } = require('constants');
 const crypto = require('crypto');
 const express = require('express');
 const fetch = require('node-fetch');
 const response_file = require('./response.json')

 const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
 const ffmpeg = require('fluent-ffmpeg');
 ffmpeg.setFfmpegPath(ffmpegPath);
 const https = require('https');
 const fs = require('fs');
 const Q = require('q')



 var amount=-999;
 var calorie=-100
 
 let Wit = null;
 let log = null;
 try {
   // if running from repo
   Wit = require('../').Wit;
   log = require('../').log;
 } catch (e) {
   Wit = require('node-wit').Wit;
   log = require('node-wit').log;
 }
 
 // Webserver parameter
 const PORT = process.env.PORT || 8445;
 
 // Wit.ai parameters
 const WIT_TOKEN = "FAX746ZHPURD6LGECJEITV3DLKERRSFQ"
 



 // Messenger API parameters
//EAAJCajlxoWEBAGZAvW0c9VV4ZBXjMREhaDgNqEMN7ZCBCloLuGEzsphKz8xsIyMYhL0GPHGnmezA7CjkSJziPkFviHtII8vi44q5nSuQojHpnH9E2dGWnzJ8m64CWguZCOTIfg6BbOL2NWESVJQaZArjd9yg79wEHZCR9buXRyMcpshaiZAaOmj

 const FB_PAGE_TOKEN = "EAAJCajlxoWEBAGZAvW0c9VV4ZBXjMREhaDgNqEMN7ZCBCloLuGEzsphKz8xsIyMYhL0GPHGnmezA7CjkSJziPkFviHtII8vi44q5nSuQojHpnH9E2dGWnzJ8m64CWguZCOTIfg6BbOL2NWESVJQaZArjd9yg79wEHZCR9buXRyMcpshaiZAaOmj"
 if (!FB_PAGE_TOKEN) { throw new Error('missing FB_PAGE_TOKEN') }
 const FB_APP_SECRET = "6267d41251edfd4c86f77e27b5013bbd"

 //APP SEC: 6267d41251edfd4c86f77e27b5013bbd
 if (!FB_APP_SECRET) { throw new Error('missing FB_APP_SECRET') }
 
 let FB_VERIFY_TOKEN = null;
 crypto.randomBytes(8, (err, buff) => {
   if (err) throw err;
   FB_VERIFY_TOKEN = "restropedia"
   console.log(`/webhook will accept the Verify Token "${FB_VERIFY_TOKEN}"`);
 });
 
 // ----------------------------------------------------------------------------
 // Messenger API specific code
 
 // See the Send API reference
 // https://developers.facebook.com/docs/messenger-platform/send-api-reference
 
 const fbMessage = (id, text) => {
   const body = JSON.stringify({
     recipient: { id },
     message: { text },
   });
   const qs = 'access_token=' + encodeURIComponent(FB_PAGE_TOKEN);
   return fetch('https://graph.facebook.com/me/messages?' + qs, {
     method: 'POST',
     headers: {'Content-Type': 'application/json'},
     body,
   })
   .then(rsp => rsp.json())
   .then(json => {
     if (json.error && json.error.message) {
       throw new Error(json.error.message);
     }
     return json;
   });
 };
 
 // ----------------------------------------------------------------------------
 // Wit.ai bot specific code
 
 // This will contain all user sessions.
 // Each session has an entry:
 // sessionId -> {fbid: facebookUserId, context: sessionState}
 const sessions = {};
 
 const findOrCreateSession = (fbid) => {
   let sessionId;
   // Let's see if we already have a session for the user fbid
   Object.keys(sessions).forEach(k => {
     if (sessions[k].fbid === fbid) {
       // Yep, got it!
       sessionId = k;
     }
   });
   if (!sessionId) {
     // No session found for user fbid, let's create a new one
     sessionId = new Date().toISOString();
     sessions[sessionId] = {fbid: fbid, context: {}};
   }
   return sessionId;
 };
 
 // Setting up our bot
 const wit = new Wit({
   accessToken: WIT_TOKEN,
   logger: new log.Logger(log.INFO)
 });
 
 // Starting our webserver and putting it all together
 const app = express();
 app.use(({method, url}, rsp, next) => {
   rsp.on('finish', () => {
     console.log(`${rsp.statusCode} ${method} ${url}`);
   });
   next();
 });
 app.use(bodyParser.json({ verify: verifyRequestSignature }));
 
 // Webhook setup
 app.get('/webhook', (req, res) => {
   if (req.query['hub.mode'] === 'subscribe' &&
     req.query['hub.verify_token'] === FB_VERIFY_TOKEN) {
     res.send(req.query['hub.challenge']);
   } else {
     res.sendStatus(400);
   }
 });
 



  var download_and_convert = function (url) {

    var defer = Q.defer()
    console.log("Inside download and convert")
    const path = './media/user_voice.mp4' // where to save a file
    const request = https.get(url, function(response) {
        if (response.statusCode === 200) {
            var file = fs.createWriteStream(path);
            response.pipe(file);


            setTimeout(() => {
              ffmpeg()
              .input('./media/user_voice.mp4')
              .output('./media/user_voice_conv.wav')
              .run()
            }, 3000)

        }
        request.setTimeout(60000, function() { // if after 60s file not downlaoded, we abort a request 
            request.abort();
        })
        
    })

    // sleep(10000)

    console.log("Here!")
    console.log(defer.promise)
    // speech_to_text_wit()

    defer.resolve()
    return defer.promise
  }

 // Message handler
 app.post('/webhook', (req, res) => {
   // Parse the Messenger payload
   // See the Webhook reference
   // https://developers.facebook.com/docs/messenger-platform/webhook-reference
   const data = req.body;
   console.log(wordsToNumbers('nine'))
   if (data.object === 'page') {
     data.entry.forEach(entry => {
       entry.messaging.forEach(event => {
         if (event.message && !event.message.is_echo) {
           // Yay! We got a new message!
           // We retrieve the Facebook user ID of the sender
           const sender = event.sender.id;
 
           // We could retrieve the user's current session, or create one if it doesn't exist
           // This is useful if we want our bot to figure out the conversation history
           // const sessionId = findOrCreateSession(sender);
 
           // We retrieve the message content
           const {text, attachments} = event.message;
 
           if (attachments) {
             // We received an attachment
             // Let's reply with an automatic message

             console.log(attachments[0]['payload'])  
             var url = attachments[0]['payload']['url']   
             

            download_and_convert(url)
              .then(() => {
                setTimeout(() => {
                  console.log("Inside Wit!")
                  var req_wit = require('request');
                  var options = {
                    'method': 'POST',
                    'url': 'https://api.wit.ai/speech?v=2020051',
                    'headers': {
                      'Authorization': 'Bearer FAX746ZHPURD6LGECJEITV3DLKERRSFQ',
                      'Content-Type': 'audio/wave'
                    },
                    body: fs.createReadStream('./media/user_voice_conv.wav')
                  
                  };
                  req_wit(options, function (error, response) {
                    if (error) throw new Error(error);
                    console.log(response.body);
                    let body = JSON.parse(response.body);

                    let intent_name
                    if (body.intents.length > 0) 
                    {
                      intent_name = body.intents[0].name

                      if (intent_name == 'greeting') {
                        for (let i=0; i<response_file.length; i++)
                        {
                            if(response_file[i]['intent'] == intent_name)
                            {
                                var random = Math.floor(Math.random() * response_file[i]['response'].length);
                                console.log(response_file[i]['response'][random]);
                                fbMessage(sender, response_file[i]['response'][random]);


                                for(var k=0;k <10000; k++ ) {
                                  for (var j=0;j<10000; j++)
                                  {

                                  }
                                }


                                random = Math.floor(Math.random() * response_file[i]['after_greeting'].length);
                                console.log(response_file[i]['after_greeting'][random]);
                                fbMessage(sender, response_file[i]['after_greeting'][random]);
                            }
                        }
                      }


                      if (intent_name == 'spend_capacity') {

                        if(body.entities['wit$amount_of_money:amount_of_money']){
                            amount = body.entities['wit$amount_of_money:amount_of_money'][0]['value']
                        }

                        if(body.entities['Calories:Calories']){
                          for (let x=0;x<body.entities['Calories:Calories'].length;x++) {
                            let int_cal = parseInt(body.entities['Calories:Calories'][0]['value'])
                            if (int_cal != 'NaN') {
                              calorie = parseInt(body.entities['Calories:Calories'][0]['value'])
                            }
                          }
                        }

                        if (calorie<0 && amount>=0) {
                            fbMessage(sender, `Cool, so you want to spend $${amount} on your food. How much maximum calories you want to take in?`);
                        }else if(calorie>=0 && amount>=0) {
                            fbMessage(sender, `Cool, so you want to spend $${amount} on your food and you want to have ${calorie} Intake. Let me search perfect food for you...`);
                            //api_call to restaurant
                            amount=-999
                            calorie=-100
                        }else if(calorie<0 && amount<0) {
                            fbMessage(sender, `Sorry I didn't get your values, can you please repeat your money and calorie requirement again?`);
                        }

                    }

                  } else {
                    fbMessage(sender, `Sorry I didn't get you. Can you please repeat again?`);
                  }

                  });

                }, 5000);
                console.log("Hi")
              })
           } else if (text) {
             // We received a text message
             // Let's run /message on the text to extract some entities, intents and traits
             wit.message(text).then(({entities, intents, traits}) => {
               // You can customize your response using these
               console.log(intents);
               console.log(entities);
               console.log(traits);

                if (intents.length == 0) {
                    fbMessage(sender, `Sorry, I'm keep improving myself. I don't know how to react to this. Can you please ask another question?`);
                    
                }
                else {

                    var intent_name = intents[0]['name']
                    console.log("Intent name: ", intent_name)

                    //for only money
                    if (intent_name == 'spend_capacity') {

                        if(entities['wit$amount_of_money:amount_of_money']){
                            amount = entities['wit$amount_of_money:amount_of_money'][0]['value']
                        }

                        if(entities['Calories:Calories']){
                          for (let x=0;x<entities['Calories:Calories'].length;x++) {
                            let int_cal = parseInt(entities['Calories:Calories'][0]['value'])
                            if (int_cal != 'NaN') {
                              calorie = parseInt(entities['Calories:Calories'][0]['value'])
                            }
                          }
                        }

                        if (calorie<0 && amount>=0) {
                            fbMessage(sender, `Cool, so you want to spend $${amount} on your food. How much maximum calories you want to take in?`);
                        }else if(calorie>=0 && amount>=0) {
                            fbMessage(sender, `Cool, so you want to spend $${amount} on your food and you want to have ${calorie} Intake. Let me search perfect food for you...`);
                            //api_call to restaurant
                            amount=-999
                            calorie=-100
                        }else if(calorie<0 && amount<0) {
                            fbMessage(sender, `Sorry I didn't get your values, can you please repeat your money and calorie requirement again?`);
                        }

                    }
                    
                    //for both calorie and money
                    if (intent_name == 'both_calorie_and_money') {
                        if(entities['wit$amount_of_money:amount_of_money']){
                            amount = entities['wit$amount_of_money:amount_of_money'][0]['value']
                        }
                        if(entities['Calories:Calories']){
                          for (x=0;x<entities['Calories:Calories'].length;x++) {
                            let int_cal = parseInt(entities['Calories:Calories'][0]['value'])
                            if (int_cal != 'NaN') {
                              calorie = parseInt(entities['Calories:Calories'][0]['value'])
                            }
                          }

                        }

                        if (calorie<0 && amount>=0) {
                          fbMessage(sender, `Cool, so you want to spend $${amount} on your food. How much maximum calories you want to take in?`);
                      }else if(amout<0 && calorie>=0) {
                          fbMessage(sender, `Amazing, you want to take ${calorie} calories, and how much amount you want to spend?`);
                      }else if(calorie<0 && amount<0)
                      {
                        fbMessage(sender, `Sorry I didn't get your values, can you please repeat your money and calorie requirement again?`);
                      }else {
                        fbMessage(sender, `Cool, so you want to spend $${amount} on your food and you want to have ${calorie} Intake. Let me search perfect food for you...`);
                        //api_call to restaurant
                        amount=-999
                        calorie=-100
                      }
                    }

                    //only calorie
                    if(intent_name == 'Calories')
                    {
                      if(entities['wit$amount_of_money:amount_of_money']){
                        amount = entities['wit$amount_of_money:amount_of_money'][0]['value']
                      }

                      if(entities['Calories:Calories']){
                        for (let x=0;x<entities['Calories:Calories'].length;x++) {
                          let int_cal = parseInt(entities['Calories:Calories'][x]['value'])
                          if (isNaN(int_cal)) {
                            console.log("NaN Case, Ignore!")
                          } else {
                            calorie = int_cal
                          }
                        }
                      }

                      console.log(calorie, amount)

                      if (amount<0 && calorie>=0) {
                        fbMessage(sender, `Nice, you want to take ${calorie} calories for this hour, may i know your budget?`);
                      }else if(calorie>=0 && amount>=0) {
                          fbMessage(sender, `Cool, so you want to spend $${amount} on your food and you want to have ${calorie} Intake. Let me search perfect food for you...`);
                          //api_call to restaurant
                          amount=-999
                          calorie=-100
                      }else if((calorie<0 || isNaN(calorie)) && amount<0) {
                          fbMessage(sender, `Sorry I didn't get your values, can you please repeat your money and calorie requirement again?`);
                      }else if (calorie<0 && amount>=0) {
                          fbMessage(sender, `Cool, so you want to spend $${amount} on your food. How much maximum calories you want to take in?`);
                      }
                      
                    }
                    

                    if (intent_name == 'greeting') {
                        for (let i=0; i<response_file.length; i++)
                        {
                            if(response_file[i]['intent'] == intent_name)
                            {
                                var random = Math.floor(Math.random() * response_file[i]['response'].length);
                                console.log(response_file[i]['response'][random]);
                                fbMessage(sender, response_file[i]['response'][random]);


                                for(var k=0;k <10000; k++ ) {
                                  for (var j=0;j<10000; j++)
                                  {

                                  }
                                }


                                random = Math.floor(Math.random() * response_file[i]['after_greeting'].length);
                                console.log(response_file[i]['after_greeting'][random]);
                                fbMessage(sender, response_file[i]['after_greeting'][random]);
                            }
                        }
                    }
                }

             })
             .catch((err) => {
               console.error('Oops! Got an error from Wit: ', err.stack || err);
             })
           }
        }
        //  } else {
        //    console.log('received event', JSON.stringify(event));
        //  }
       });
     });
   }
   res.sendStatus(200);
 });
 
 /*
  * Verify that the callback came from Facebook. Using the App Secret from
  * the App Dashboard, we can verify the signature that is sent with each
  * callback in the x-hub-signature field, located in the header.
  *
  * https://developers.facebook.com/docs/graph-api/webhooks#setup
  *
  */
 function verifyRequestSignature(req, res, buf) {
   var signature = req.headers["x-hub-signature"];
   console.log(signature);
 
   if (!signature) {
     // For testing, let's log an error. In production, you should throw an
     // error.
     console.error("Couldn't validate the signature.");
   } else {
     var elements = signature.split('=');
     var method = elements[0];
     var signatureHash = elements[1];
 
     var expectedHash = crypto.createHmac('sha1', FB_APP_SECRET)
                         .update(buf)
                         .digest('hex');
 
     if (signatureHash != expectedHash) {
       throw new Error("Couldn't validate the request signature.");
     }
   }
 }
 
  var dir = './media';

  if (!fs.existsSync(dir)){
      fs.mkdirSync(dir);
  }


 app.listen(PORT);
 console.log('Listening on :' + PORT + '...');