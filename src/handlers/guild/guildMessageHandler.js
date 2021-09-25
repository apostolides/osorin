const player = require('./youtube/player.js');

module.exports = {
  handleMessage:(clientObject,messageObject,message,botPrefix,botName)=>{
      switch(message[1]){
        case "play":
          player.qplayer(messageObject,message);
          break;
        case "skip":
          player.skip();
          break;
        case "q":
          player.list_queue(messageObject,message);
          break;
        case "empty":
          player.empty();
          break;
        default:
          messageObject.channel.send("sorin play,skip,q,empty <search_query>");
          break;
    }
  }
}