

import * as TelegramBot from 'node-telegram-bot-api';
//var TelegramBot: any = require('node-telegram-bot-api');

console.log('Loaded');

var token = '325204753:AAEKucZSdwSUvYcw0uN8zkXHszTg-hxVcPQ';

var bot = new TelegramBot(token, {polling: true});

bot.onText(/\/echo (.+)/, function (msg, match) {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  var chatId = msg.chat.id;
  var resp = match[1]; // the captured "whatever"

  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, resp);
});

bot.onText(/\/setStandup ([0-9.]+)/, function (msg, match) {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  var chatId = msg.chat.id;
  var time = Number(match[1]); // the captured "whatever"

  setTimeout((chatID) => {
  	bot.sendMessage(chatId, "STANDUP TIME BINCH!!!!!");
  }, time * 60 * 1000, chatId)

  // send back the matched "whatever" to the chat

  bot.sendMessage(chatId, "Set standup reminder for " + time + " minutes");
});


bot.on('message', function (msg) {
  var chatId = msg.chat.id;

  // send a message to the chat acknowledging receipt of their message
  bot.sendMessage(chatId, "Received your message");
});