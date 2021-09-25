const ENV = require('dotenv');
ENV.config();

const Discord = require('discord.js');
const client = new Discord.Client();
const messageHandler = require('./handlers/messageHandler.js');

const BOT_TOKEN = process.env.DISCORD_CLIENT_SECRET;

client.on('message',(message)=>{
  messageHandler.handleMessage(client,message);
});

client.login(BOT_TOKEN);
