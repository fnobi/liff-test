import * as functions from 'firebase-functions';
import * as line  from '@line/bot-sdk';
import * as express from 'express';

// create LINE SDK config from env variables
const LINE_CONFIG = functions.config().line || {};
const LIFF_URI = LINE_CONFIG.liff_uri || '';
const config = {
  channelAccessToken: LINE_CONFIG.channel_access_token || "",
  channelSecret: LINE_CONFIG.channel_secret || "",
};

// create LINE SDK client
const client = new line.Client(config);

// create Express app
// about Express itself: https://expressjs.com/
const app = express();

// register a webhook handler with middleware
// about the middleware, please refer to doc
app.post('/callback', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      console.error(err.originalError.response.data);
      res.status(500).end();
    });
});

app.get('/ping', (req, res) => {
  res.status(200);
  res.send('ok');
});

// event handler
function handleEvent(event: line.WebhookEvent) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    // ignore non-text-message event
    return Promise.resolve(null);
  }

  // create a echoing text message
  const echoMessage: line.TextMessage = { type: 'text', text: event.message.text };

  const buttonTemplate: line.TemplateButtons = {
    type: 'buttons',
    text: 'どうする？？',
    actions: [{
      type: 'uri',
      label: 'ゲームをはじめる',
      uri: LIFF_URI
    },{
      type: 'message',
      label: 'テキストを送る',
      text: 'hello.'
    }]
  };
  const buttonMessage: line.TemplateMessage = {
    type: 'template',
    altText: 'button',
    template: buttonTemplate
  };

  const isButton = LIFF_URI && event.message.text === 'button';

  // use reply API
  return client.replyMessage(event.replyToken, isButton ? buttonMessage : echoMessage);
}

exports.api = functions.https.onRequest(app);