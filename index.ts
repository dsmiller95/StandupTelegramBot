

import * as TelegramBot from 'node-telegram-bot-api';
import { Message } from './telegramTypes';

//var TelegramBot: any = require('node-telegram-bot-api');

import { StateManager, State } from './state_manager';

console.log('Loaded');

var token = '325204753:AAEKucZSdwSUvYcw0uN8zkXHszTg-hxVcPQ';

var bot = new TelegramBot(token, {polling: true});
var manager = new StateManager(1000 * 60 * 60, bot); //1 hr of permanance


bot.on('message', function (msg: Message) {
  var chatId = msg.chat.id;

  if('text' in msg){
    //bot.sendMessage(chatId, "Delegated your message");
    manager.delegateMessge(chatId, msg);
  }
  // send a message to the chat acknowledging receipt of their message
  //bot.sendMessage(chatId, "Received your message");
});