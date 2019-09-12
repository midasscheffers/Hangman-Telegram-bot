const TeleBot = require('telebot');

var myID = "330958566";

var Words = ["tetris", "galgje", "qat", "yak", "bananen", "taart", "zuivel", "kort", "lang"];
var Word = Words[Math.floor(Math.random() * Words.length)];
var SeceretWord = "-".repeat(Word.length);
var currentStage = 0;
var lettersUsed = [];

function stageStr(stage){
  switch(stage){
    case 0:
      return "";
    case 1:
      return "\n-----------\n";
    case 2:
      return "\n|\n|\n|\n|\n|\n|\n-----------\n";
    case 3:
      return "\n| /\n|/\n|\n|\n|\\\n| \\\n-----------\n";
    case 4:
      return "\n-----------\n| /\n|/\n|\n|\n|\\\n| \\\n-----------\n";
    case 5:
      return "\n-----------\n| /       |\n|/\n|\n|\n|\\\n| \\\n-----------\n";
    case 6:
      return "\n-----------\n| /       |\n|/        0\n|\n|\n|\\\n| \\\n-----------\n";
    case 7:
      return "\n-----------\n| /       |\n|/        0\n|         |\n|         |\n|\\\n| \\\n-----------\n";
    case 8:
      return "\n-----------\n| /       |\n|/        0\n|        \\|/\n|         |\n|\\\n| \\\n-----------\n";
    case 9:
      return "\n-----------\n| /       |\n|/        0\n|        \\|/\n|         |\n|\\       / \\\n| \\\n-----------\n";
  }
}

function include(arr, obj) {
  for(var i=0; i<arr.length; i++) {
      if (arr[i] == obj) return true;
  }
  return false;
}

function getBotSayStr(currentStage, SeceretWord, lettersUsed, used, win, lose){
  str = "";
  if (win){
    str += "je hebt gewonnen, type /start om opnieuw te beginnen";
    return str;
  }
  if (lose){
    str += stageStr(currentStage);
    str += "je hebt verloren ";
    str += "het woord was: " + Word;
    str += ", type /start om opnieuw te beginnen";
    return str;
  }
  str += stageStr(currentStage);
  str += "gebruikte letters: " + lettersUsed + "\n";
  str += "woord: " + SeceretWord + "\n";
  if (used){
    str += "deze letter heb je al gebruikt\n";
  }
  return str;
}

function letterInWord(letter, word){
  for(var i = 0; i < word.length; i++){
    if (letter == word[i]){
      return true;
    }
  }
  return false;
}

function PutLetterInSecretWord(lttr, sWord, wrd){
  for(var i = 0; i < wrd.length; i++){
    if (lttr == wrd[i]){
      sWord = sWord.slice(0, i) + lttr + sWord.slice(i+1, sWord.length);
    }
  }
  return sWord;
}

const bot = new TeleBot({
    token: '968506699:AAEJx5c0izHNUgHHQi1bLsbB_atKPlNafCw' // Telegram Bot API token.
});


bot.on("/start", (msg) =>{
  Word = Words[Math.floor(Math.random() * Words.length)];
  SeceretWord = "-".repeat(Word.length);
  currentStage = 0;
  lettersUsed = [];
  return bot.sendMessage(msg.from.id, "hallo met mij kan je galgje spelen, Type een letter die in mijn geheime woord kan zitten");
});


bot.on(/.+/, (msg) =>{

  if (msg.text.match(new RegExp(/^[Hh][AaOoEe0]*[IiYy]|[Hh][Aa][Ll][Ll][Oo0]|[Ee][Ww][Aa]/))){
    return bot.sendMessage(msg.from.id, "hallo");
  }
  else if (msg.text.match(new RegExp(/^[A-Za-z]+$/))){
    var used = false;
    var win = false;
    var lose = false;
    if (msg.text.length == 1){
      if (letterInWord(msg.text, Word)){
        SeceretWord = PutLetterInSecretWord(msg.text, SeceretWord, Word);
        if (SeceretWord == Word){
          win = true;
        }
      }
      else{
        if(include(lettersUsed, msg.text)){
          used = true;
        }
        else {
          currentStage ++;
          if (currentStage >= 9){
            lose = true;
          }
          lettersUsed.push(msg.text);
        }
      }
    }
    else{
      if (msg.text == Word){
        win = true;
      }
      else if (currentStage < 9){
        currentStage ++;
      }
      else {
        lose = true;
      }
    }
    console.log("\n")
    console.log(msg.from.first_name + " " + msg.from.last_name + " from id:" + msg.chat.id + " sayed: " + msg.text)
    console.log("Bot replyed: " + getBotSayStr(currentStage, SeceretWord, lettersUsed, used, win, lose))
    return bot.sendMessage(msg.from.id, getBotSayStr(currentStage, SeceretWord, lettersUsed, used, win, lose));
  }


});

bot.start();
