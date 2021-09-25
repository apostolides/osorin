const ytdl = require("discord-ytdl-core");
const axios = require("axios").default;

let queue = [];
let dispatcher = null;
let YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

function qplayer(messageObject,message){
    let query = message.slice(2).join(" ");
    let voiceChannel = messageObject.member.voice.channel;
    if(!voiceChannel){
      messageObject.channel.send("Please join a voice channel first.");
      return;
    }
    let permissions = voiceChannel.permissionsFor(messageObject.client.user);
    if(!permissions.has('CONNECT') || !permissions.has('SPEAK')){
      messageObject.channel.send("I can't access this voice channel.");
    }
    else{
      voiceChannel.join().then(async(connection)=>{
        try{
          let link = await link_from_query(query);
          queue.push(link);
          if(dispatcher == null){
            play(connection);
          }
        }
        catch(err){
          console.error(err);
          messageObject.channel.send("I can't play this one.");
        }
      });
    }
}

function play(connection){
  let stream = ytdl(queue[0],{filter:"audioonly",fmt: "mp3"});
  queue.shift();
  dispatcher = connection.play(stream)
  .on("finish",()=>{
    if(queue[0]){
      play(connection);
    }
    else{
      dispatcher = null;
    }
  });
}

function skip(){
  if(dispatcher != null){
    dispatcher.end();
  }
}

function list_queue(messageObject){
  if(queue.length == 0 ){
    messageObject.channel.send("Queue is empty.");
  }
  else{
    messageObject.channel.send(queue);
  }
}

function empty(){
  queue = [];
}

async function link_from_query(query){
  if(query.includes("youtube.") || query.includes("youtu.be")){
    return query;
  }
  let search_query = query.replace("/ /g","+");
  let response = await axios.get(`https://www.googleapis.com/youtube/v3/search?q=${search_query}&key=${YOUTUBE_API_KEY}`);
  let link = `https://www.youtube.com/watch?v=${response.data.items[0].id.videoId}`;
  return link;
}

module.exports = {qplayer:qplayer,list_queue:list_queue,skip:skip,empty:empty}