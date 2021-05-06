const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);
const https = require('https');
const fs = require('fs');
const fetch = require('node-fetch');

var request = require('request');
var options = {
  'method': 'POST',
  'url': 'https://api.wit.ai/speech?v=2020051',
  'headers': {
    'Authorization': 'Bearer FAX746ZHPURD6LGECJEITV3DLKERRSFQ',
    'Content-Type': 'audio/wave'
  },
  body: fs.createReadStream('/Users/ashwin/Downloads/media/user_voice_conv.wav')

};
request(options, function (error, response) {
  if (error) throw new Error(error);
  console.log(response.body);
});



// var myHeaders = new fetch.Headers();
// myHeaders.append("Authorization", "Bearer FAX746ZHPURD6LGECJEITV3DLKERRSFQ");
// myHeaders.append("Content-Type", "audio/wave");

// var file = "/Users/ashwin/Downloads/media/user_voice_conv.wav";

// var requestOptions = {
// method: 'POST',
// headers: myHeaders,
// body: file,
// redirect: 'follow'
// };

// fetch("https://api.wit.ai/speech?v=2020051", requestOptions)
// .then(response => response.text())
// .then(result => console.log(result))
// .catch(error => console.log('error', error));


// const url = 'https://cdn.fbsbx.com/v/t59.3654-21/176589168_1479952582347353_512556917360269615_n.mp4/audioclip-1620249608000-3553.mp4?_nc_cat=110&ccb=1-3&_nc_sid=7272a8&_nc_ohc=_80NO62epZgAX-FQ8qT&_nc_ht=cdn.fbsbx.com&oh=029e61f435299ca28de51d9fe1afea82&oe=6094F76E'; // link to file you want to download
// const path = '/Users/ashwin/Downloads/media/cool.mp4' // where to save a file

// const request = https.get(url, function(response) {
//     if (response.statusCode === 200) {
//         var file = fs.createWriteStream(path);
//         response.pipe(file);
//         ffmpeg()
//         .input('/Users/ashwin/Downloads/media/cool.mp4')
//         .output('/Users/ashwin/Downloads/media/brother_cool.wav')
//         .run();
//     }
//     request.setTimeout(60000, function() { // if after 60s file not downlaoded, we abort a request 
//         request.abort();
//     });
// });


