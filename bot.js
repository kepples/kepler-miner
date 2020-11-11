const http = require('http');
const express = require('express');
const app = express();
var server = require('http').createServer(app);
app.get("/", (request, response) => {
  console.log(Date.now() + " Ping Received, bonk!");
  response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);

//Your bot code goes down here 👇
const Commando = require('discord.js'); //there is no commando
const fs = require('fs');
const moment = require('moment');
const bot = new Commando.Client({commandPrefix: 'kb!'});
const TOKEN = process.env.TOKEN;
/*const DBL = require('dblapi.js');
const dbl = new DBL(process.env.DBLTOKEN, { webhookServer: server, webhookAuth: "authorkeplerminerbot"}, bot);*/
const profanities = require("profanities");

/** BIG VARIABLES */
var maintenance = !true;
var version = "Revamp 1.0";
var newfeatures = "**NEW FEATURES:**\n**- New Textures:** All textures are now 1.14 themed with a little touch!\n**- New Pickaxes:** Meet the Goldium, Diamondite, Emeraldium and Golem pickaxes, each has higher chances at finding their own material!\n**- Temp Removal of Features:** Features such as The Nether, Potions, Multimine, Arenas and Villagers!\n**- Crates become Lootboxes:** There are approx 50 prizes to potentally get from a lootbox! You can find lootboxes while mining or if you vote for the bot on top.gg!\n**- Enchant Revamp:** Luck enchant has been removed for being really op and the cooldown and regen cooldown are seperate enchants! The pickaxes all each have their own enchant set as well.\n**- Slice of life features:** There are now over a dozen leaderboards, stats, data is revamped, balancing of ores.\n**- Potental Bugs:** If you find any bugs, too op things or exploits, please let me know by going into the kepler miner server and report it in #bugs-and-problems";
var updatereleased = "2020/05/07"
var waittime = 3000;
var regentime = 180000;
var lastmultiregen = 0;
/** SIMPLE COMMANDS */
//Universal Variables:
var dice = [
    "<:dice1:550358709251866642>",
    "<:dice2:550358709348466709>",
    "<:dice3:550358709633810436>",
    "<:dice4:550358709415706635>",
    "<:dice5:550358709466038273>",
    "<:dice6:550358709545730069>",
];
var coins = ["<:Heads:553050199350706176>", "<:Tails:553050202085523468>"];
var Message = function(t, m, message, c){
  c = c || "22ff88";
  let embed = new Commando.RichEmbed()
        .setAuthor(bot.user.username, bot.user.avatarURL)
        .setTitle(t)
        .setDescription(m)
        .setColor(c)
        .setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL);
        //.setTimestamp();

    message.channel.send(embed);
};
//Functions
/*var CoinFlipCommand = function(message){
    var chance = Math.floor(Math.random()*2);
    if(chance == 0){
      Message("Coin", "It landed on Heads! " + coins[0], message, "888888");
    }
    else if(chance == 1){
      Message("Coin", "It landed on Tails! " + coins[1], message, "888888");
    }
};
var DiceRollCommand = function(message){
    var chance = 1 + Math.floor(Math.random()*6);
    Message("Dice", "The dice rolled a " + chance + "!" + "  " + dice[chance-1], message, "bbbbbb");
    //message.channel.send("The dice rolled a " + chance + "!" + "  " + dice[chance-1]);
};
var PickFromCommand = function(message, args){
    var num = Math.floor(args[0]);
    var chance = Math.floor(Math.random()*num);
    //message.reply("The number I have chosen is " + chance);
    Message("Pickfrom", "The number I have chosen is " + chance, message, "bbbbbb");
};
*/
/** OTHER COMMANDS */
//Variables
var Helps = [
    {
        name: "kb!mine [dir] or kb!m [dir]",
        values: "dir: right, left, up or down, can use single letters as well",
        d: "Mines a block in the direction said with your pickaxe",
    },
    {
        name: "kb!inv or kb!inventory",
        values: "none",
        d: "Checks your inventory",
    },
    {
        name: "kb!regenland or kb!rl",
        values: "none",
        d: "Regenrates your land!",
    },
    {
        name: "kb!backup",
        values: "none",
        d: "Backups the user data",
    },
    {
        name: "kb!craft",
        values: "none",
        d: "Craft pickaxes, portals and more pickaxes!",
    },
    {
        name: "kb!prefix",
        values: "",
        d: "Check out the current prefix of your server",
    },
    {
        name: "kb!setprefix",
        values: "",
        d: "Set the prefix of TKM on your server, must be server administrator",
    },
    {
        name: "kb!top or kb!toplist",
        values: "none",
        d: "Top 10 users sorted by xp",
    },
    {
        name: "kb!pickaxe <pickaxe id>",
        values: "none",
        d: "Switches your pickaxe to the one selected!",
    },
    {
        name: "kb!crate [common:uncommon:rare:legendary]",
        values: "none",
        d: "Look at your crates or open a crate!",
    },
    {
        name: "kb!shop <cooldown:enchant> [id]",
        values: "cooldown:enchant is the store, and id which is optional, is the item you want to buy",
        d: "Go to the shop and buy stuffs",
    },
    {
        name: "kb!trade",
        values: "plenty, do the command to see how to use it ;)",
        d: "Trade with a person.",
    },
    {
        name: "kb!give",
        values: "plenty, do the command to see how to use it ;)",
        d: "Give a person some material",
    },
    {
        name: "kb!about",
        values: "none",
        d: "Info on the kepler bot!",
    },
    {
        name: "kb!invite",
        values: "none",
        d: "Invite the Kepler Miner to your server!",
    },
    {
        name: "kb!server",
        values: "none",
        d: "Invite link for The Kepler Miner Official Server!",
    },
    {
        name: "kb!stats",
        values: "none",
        d: "Stats on The Kepler Miner!",
    },
    {
        name: "kb!vote",
        values: "none",
        d: "Vote for the Kepler Miner and get crates!",
    },
    {
        name: "kb!help [page]",
        values: "none",
        d: "This exact command, known as the help command!",
    },
    {
        name: "kb!changelog",
        values: "none",
        d: "Vote for the Kepler Miner and get crates!",
    },
];

//Functions
var ChangeLogCommand = function(message){
    Message("**NEW FEATURES:** Version " + version + "! Released on " + updatereleased, newfeatures, message);
};
var AboutCommand = function(message){
    Message("About The Kepler Miner: ", "Created and Developed by: KeplerTeddy#1138\nDevelopers: WhiteRider#0428, ! FireBobb !#9999 and Zugky#0911\nHelpers: spongejr#5845\nBackup-ers: Nicholas#1138, __Timo_L_S__#9921 and WowMG#1230\nVersion: " + version + "\nProgramming Language: Node.js + Discord.js\nHosting: glitch.com", message);
};

var HelpCommand = function(message, args){
    
    var fn = "";
    var page = 0 || (Math.floor(args[0])-1);
    if(page < 0 || page > Math.floor(Helps.length/5)){
        page = 0;
    }
    var maxx = (page*5)+5;
    //fn +="Page " + (page+1) + "/" + Math.floor((Helps.length/5)+1);
    if(maxx >= Helps.length){maxx=Helps.length;}
    for(var i = page*5;i < maxx;i ++){
        //console.log(i);
        fn +="\n**" + Helps[i].name + "**\nValues: " + Helps[i].values + "\nDescription: " + Helps[i].d;
    }
    fn +="\n\nIf you want to switch to another page use **\"kb!help [page number]\"**";
    Message("Help - " + "Page " + ((page+1) + "/" + Math.floor((Helps.length/5)+1)) + "\n**You may use kb!start to get started if you haven't!**", fn, message);
};
var InviteCommand = function(message){
    message.reply("\n**Invite link:**\nhttps://bit.ly/2VD18ef");
};
var VoteCommand = function(message){
  let embed = new Commando.RichEmbed()
        .setAuthor(bot.user.username, bot.user.avatarURL)
        .setTitle('Vote for The Kepler Miner!')
        .setColor("22ff88")
        .setURL('https://bit.ly/2JbLSUf')
        .setTimestamp();

    message.channel.send(embed);
};
var ServerCommand = function(message){
  let exampleEmbed = new Commando.RichEmbed()
        .setAuthor(bot.user.username, bot.user.avatarURL)
        .setTitle('KeplerBot\'s official server!')
        .setColor("22ff88")
        .setURL('https://discord.gg/SyySZ4E')
        .setTimestamp();

    message.channel.send(exampleEmbed);
};

/** KEPLER MINER COMMANDS */

///Variables
const Datas = require('./datas.json');
const rawdata = fs.readFileSync('datas.json');  
const inv = JSON.parse(rawdata);  
var Arenas = inv.Arenas;
var Invs = inv.Invs;
var cml = "";
var TopInvs = [];
for(var i = 0;i < Invs.length;i ++){
    TopInvs.push(Invs[i]);
}

var replaceInString = function(string, item, newitem){
    var finalstring = "";
    for(var i = 0;i < string.length;i ++){
        if(i !== item){
            finalstring +=string[i];
        }
        else{
            finalstring +=newitem;
        }
    }
    return finalstring;
};
var findYourId = function(yourid){
    for(var i = 0;i < Invs.length;i ++){
        if(yourid.toString() == Invs[i].id){
            //console.log(i);
            return i;
        }
    }
    return -1;
};
var createLand = function(I, dim){
    dim = dim || 0;
    if(dim === undefined){
      dim = 0;
    }
    //pickaxe: 0 = wooden, 1 = stone, 2 = iron, 3 = diamond
    //ores: 0 = air, 1 = stone, 2 = coal, 3 = iron, 4 = gold, 5 = diamond, 6 = random ore, 7 = redstone, 8 = lapis, 9 = keplerium, a = obsidian, b = emerald
    I.d = "";
    var pick = I.pick;
    for(var i = 0;i < 7;i ++){
        for(var j = 0;j < 7;j ++){
            var mathrandom = Math.random()*10;
              if(pick == 0){ // Wooden
                  if(mathrandom >= 9){
                      I.d += "2";
                  }
                  else if(mathrandom >= -1){
                      I.d += "1";
                  }
              }
              else if(pick == 1){ // Stone
                  if(mathrandom >= 9){
                      I.d += "3";
                  }
                  else if(mathrandom >= 7){
                      I.d += "2";
                  }
                  else if(mathrandom >= -1){
                      I.d += "1";
                  }
              }
              else if(pick == 2){ //Iron
                  if(mathrandom >= 9.9){
                      I.d += "b";
                  }
                  if(mathrandom >= 9.5){
                      I.d += "5";
                  }
                  else if(mathrandom >= 9){
                      I.d += "4";
                  }
                  else if(mathrandom >= 8){
                      I.d += "3";
                  }
                  else if(mathrandom >= 6.5){
                      I.d += "2";
                  }
                  else if(mathrandom >= -1){
                      I.d += "1";
                  }
              }
              else if(pick == 3){ // Diamond
                  if(mathrandom >= 9.99){
                      I.d += "9";
                  }
                  else if(mathrandom >= 9.975){
                      I.d += "a";
                  }
                  else if(mathrandom >= 9.96){
                      I.d += "6";
                  }
                  else if(mathrandom >= 9.65){
                      I.d += "b";
                  }
                  else if(mathrandom >= 9.4){
                      I.d += "5";
                  }
                  else if(mathrandom >= 8.9){
                      I.d += "4";
                  }
                  else if(mathrandom >= 7.8){
                      I.d += "3";
                  }
                  else if(mathrandom >= 6.4){
                      I.d += "2";
                  }
                  else if(mathrandom >= -1){
                      I.d += "1";
                  }
              }
              else if(pick == 4){ //gold pick
                  if(mathrandom >= 9.5){
                      I.d += "8";
                  }
                  else if(mathrandom >= 9.0){
                      I.d += "7";
                  }
                  else if(mathrandom >= 8.5){
                      I.d += "4";
                  }
                  else if(mathrandom >= 7.9){
                      I.d += "3";
                  }
                  else if(mathrandom >= 6.8){
                      I.d += "2";
                  }
                  else if(mathrandom >= -1){
                      I.d += "1";
                  }
              }
              else if(pick == 5){ 
                //redstone pick
                  if(mathrandom >= 9.6){
                      I.d += "8";
                  }
                  else if(mathrandom >= 9.0){
                      I.d += "7";
                  }
                  else if(mathrandom >= 8.7){
                      I.d += "4";
                  }
                  else if(mathrandom >= 7.9){
                      I.d += "3";
                  }
                  else if(mathrandom >= 6.8){
                      I.d += "2";
                  }
                  else if(mathrandom >= -1){
                      I.d += "1";
                  }
              }
              else if(pick == 6){ // Lapis
                
                  if(mathrandom >= 9.4){
                      I.d += "8";
                  }
                  else if(mathrandom >= 9.0){
                      I.d += "7";
                  }
                  else if(mathrandom >= 8.7){
                      I.d += "4";
                  }
                  else if(mathrandom >= 7.9){
                      I.d += "3";
                  }
                  else if(mathrandom >= 6.8){
                      I.d += "2";
                  }
                  else if(mathrandom >= -1){
                      I.d += "1";
                  }
              }
              else if(pick == 7){ // Emerald
                
                  if(mathrandom >= 9.99){
                      I.d += "9";
                  }
                  else if(mathrandom >= 9.98){
                      I.d += "a";
                  }
                  else if(mathrandom >= 9.95){
                      I.d += "6";
                  }
                  else if(mathrandom >= 9.65){
                      I.d += "5";
                  }
                  else if(mathrandom >= 9.35){
                      I.d += "b";
                  }
                  else if(mathrandom >= 8.85){
                      I.d += "4";
                  }
                  else if(mathrandom >= 7.8){
                      I.d += "3";
                  }
                  else if(mathrandom >= 6.4){
                      I.d += "2";
                  }
                  else if(mathrandom >= -1){
                      I.d += "1";
                  }
              }
              else if(pick == 8){ //donator pick
                  if(mathrandom >= 9.985){
                      I.d += "9";
                  }
                  else if(mathrandom >= 9.975){
                      I.d += "a";
                  }
                  else if(mathrandom >= 9.96){
                      I.d += "6";
                  }
                  else if(mathrandom >= 9.65){
                      I.d += "b";
                  }
                  else if(mathrandom >= 9.4){
                      I.d += "5";
                  }
                  else if(mathrandom >= 8.9){
                      I.d += "4";
                  }
                  else if(mathrandom >= 7.8){
                      I.d += "3";
                  }
                  else if(mathrandom >= 6.4){
                      I.d += "2";
                  }
                  else if(mathrandom >= -1){
                      I.d += "1";
                  }
              }
              else if(pick == 9){ // Golem
                
                  if(mathrandom >= 9.99){
                      I.d += "9";
                  }
                  else if(mathrandom >= 9.98){
                      I.d += "a";
                  }
                  else if(mathrandom >= 9.97){
                      I.d += "6";
                  }
                  else if(mathrandom >= 9.65){
                      I.d += "5";
                  }
                  else if(mathrandom >= 9.35){
                      I.d += "b";
                  }
                  else if(mathrandom >= 8.85){
                      I.d += "4";
                  }
                  else if(mathrandom >= 6.5){
                      I.d += "3";
                  }
                  else if(mathrandom >= 6.2){
                      I.d += "2";
                  }
                  else if(mathrandom >= -1){
                      I.d += "1";
                  }
              }
              else if(pick == 10){ // Goldium
                
                  if(mathrandom >= 9.99){
                      I.d += "9";
                  }
                  else if(mathrandom >= 9.98){
                      I.d += "a";
                  }
                  else if(mathrandom >= 9.96){
                      I.d += "6";
                  }
                  else if(mathrandom >= 9.65){
                      I.d += "5";
                  }
                  else if(mathrandom >= 9.35){
                      I.d += "b";
                  }
                  else if(mathrandom >= 8.8){
                      I.d += "8";
                  }
                  else if(mathrandom >= 8.4){
                      I.d += "7";
                  }
                  else if(mathrandom >= 7.6){
                      I.d += "4";
                  }
                  else if(mathrandom >= 7.3){
                      I.d += "3";
                  }
                  else if(mathrandom >= 6.7){
                      I.d += "2";
                  }
                  else if(mathrandom >= -1){
                      I.d += "1";
                  }
              }
          
              else if(pick == 11){ // Diamondite
                
                  if(mathrandom >= 9.95){
                      I.d += "9";
                  }
                  else if(mathrandom >= 9.9){
                      I.d += "a";
                  }
                  else if(mathrandom >= 9.94){
                      I.d += "6";
                  }
                  else if(mathrandom >= 9.3){
                      I.d += "5";
                  }
                  else if(mathrandom >= 9.2){
                      I.d += "b";
                  }
                  else if(mathrandom >= 8.85){
                      I.d += "4";
                  }
                  else if(mathrandom >= 7.8){
                      I.d += "3";
                  }
                  else if(mathrandom >= 6.4){
                      I.d += "2";
                  }
                  else if(mathrandom >= -1){
                      I.d += "1";
                  }
              }
              else if(pick == 12){ // Emeraldium
                
                  if(mathrandom >= 9.99){
                      I.d += "9";
                  }
                  else if(mathrandom >= 9.9){
                      I.d += "a";
                  }
                  else if(mathrandom >= 9.96){
                      I.d += "6";
                  }
                  else if(mathrandom >= 9.7){
                      I.d += "5";
                  }
                  else if(mathrandom >= 9.1){
                      I.d += "b";
                  }
                  else if(mathrandom >= 8.85){
                      I.d += "4";
                  }
                  else if(mathrandom >= 7.8){
                      I.d += "3";
                  }
                  else if(mathrandom >= 6.4){
                      I.d += "2";
                  }
                  else if(mathrandom >= -1){
                      I.d += "1";
                  }
              }
              else if(pick == 13){ //keplerium pick
                  if(mathrandom >= 9.95){
                      I.d += "9";
                  }
                  if(mathrandom >= 9.86){
                      I.d += "9";
                  }
                  else if(mathrandom >= 9.2){
                      I.d += "8";
                  }
                  else if(mathrandom >= 8.8){
                      I.d += "7";
                  }
                  else if(mathrandom >= 8.75){
                      I.d += "6";
                  }
                  else if(mathrandom >= 8.4){
                      I.d += "b";
                  }
                  else if(mathrandom >= 8.2){
                      I.d += "5";
                  }
                  else if(mathrandom >= 7.8){
                      I.d += "4";
                  }
                  else if(mathrandom >= 7.5){
                      I.d += "3";
                  }
                  else if(mathrandom >= 6.5){
                      I.d += "2";
                  }
                  else if(mathrandom >= -1){
                      I.d += "1";
                  }
              }
        }
    }
    console.log("Created world for " + I.id);
};
/*var createMultiLand = function(minpick){
    //pickaxe: 0 = wooden, 1 = stone, 2 = iron, 3 = diamond
    var ml = "";
    for(var i = 0;i < 8;i ++){
        for(var j = 0;j < 8;j ++){
            var mathrandom = Math.random()*10;
            if(minpick === 0){
              if(mathrandom >= 9){
                  ml += "2";
              }
              else if(mathrandom >= -1){
                  ml += "1";
              }
            }
            if(minpick === 1){
              if(mathrandom >= 9){
                  ml += "3";
              }
              else if(mathrandom >= 7){
                  ml += "2";
              }
              else if(mathrandom >= -1){
                  ml += "1";
              }
            }
            if(minpick === 2){
              if(mathrandom >= 9.6){
                  ml += "5";
              }
              else if(mathrandom >= 9){
                  ml += "4";
              }
              else if(mathrandom >= 8){
                  ml += "3";
              }
              else if(mathrandom >= 6.5){
                  ml += "2";
              }
              else if(mathrandom >= -1){
                  ml += "1";
              }
            }
            if(minpick === 3){
              if(mathrandom >= 9.99){
                  ml += "9";
              }
              else if(mathrandom >= 9.9){
                  ml += "a";
              }
              else if(mathrandom >= 9.8){
                  ml += "6";
              }
              else if(mathrandom >= 9.6){
                  ml += "5";
              }
              else if(mathrandom >= 9){
                  ml += "4";
              }
              else if(mathrandom >= 8){
                  ml += "3";
              }
              else if(mathrandom >= 6.5){
                  ml += "2";
              }
              else if(mathrandom >= -1){
                  ml += "1";
              }
            }
        }
    }
    return ml;
    console.log("Created new multiplayer land!");
};*/
var findYourPlace = function(yourid){
    for(var i = 0;i < TopInvs.length;i ++){
        if(yourid.toString() == TopInvs[i].id){
            //console.log(i);
            return i;
        }
    }
    return -1;
};
var levelUp = function(I, message){
  var oldlevel = Math.floor(I.lvl + 0.01);
  while(I.xp >= 100+(I.lvl^3)){
          I.xp -=100+(I.lvl^3);
          I.lvl ++;
  }
  if(oldlevel < I.lvl){
    Message("LEVEL UP", xp + "You got to level " + I.lvl + "! " + xp, message, "eeee33");
  }
  
};
var tokenToUser = async function(id){
    await bot.fetchUser(id.toString())
    .then(user => {
       return user;
   }).catch(error => {
       return error;
    // here you can also try log it to console
  });
};
var makeNewInventory = function(message, name, id){
  var Name = name || message.author.username.toString();
  var Id = id || message.author.id;
  Invs.push({
      pickp:[3,3], //where their pickaxe is on the mining place
      id: Id, //the id of the user to identify them
      d: "", //mining data, what their mine looks like
      inv:{st:0,co:0,ir:0,go:0,di:0,re:0,la:0,ke:0,em:0,ob:0}, //their inventory, stone, coal, iron, gold, diamond, redstone, lapis, keplerium, emerald and obsidian
      pick:0, //the pickaxe they're holding
      lvl:1, //level of the user
      xp:0, //xp of the user, the amount of exp to get to the next level starts as 100, perhaps a forumla of 100+(l^3) which accelerates fairly fast
      name:Name, //the name of the user
      last:[0, 0], //last mine, last regenerate
      picks: "10000000000000", //wooden, stone, iron, diamond, gold, redstone, lapis, emerald, donator, golem, goldium, diamondite, emeraldium and keplerium
      crates: 0, //amount of crates the user has
      en: {
        fortune: "00000000000000", //max level is 3, 2-3 mats compared to the regular 1
        eff: "00000000000000", //max level is 5, 2.5 second cooldown compared to the normal 5 second cooldown
        xp: "00000000000000", //max level is 3, 30% more exp.
        cd: "00000000000000", //max level is 5: 120 0, 105 I, 90 II, 75 III, 60 IV, 45 V
      },
      donator: 0,
      tut: 0,
      sts: [0,0,0,0,0,0,0,0,0,0,0,0,0,0], //blocks mined, lootboxes opened, items enchanted, regenerated lands, stone mined, coal mined, iron mined, gold mined, diamond mined, redstone mined, lapis mined, keplerium mined, emerald mined, obsidian mined
      minerscore: 0,
  });
  /*Invs.push({
        pickx: 3,
        picky: 3,
        id: Id,
        d: "",
        inv:{
            stone:0,
            coal:0,
            iron:0,
            gold:0,
            diamond:0,
            redstone:0,
            lapis:0,
            keplerium:0,
            emerald: 0,
            obsidian: 0,
            netherrack: 0,
            soulsand: 0,
            quartz: 0,
        },
        pick: 0,
        level: 1,
        mp: {x:4,y:4},
        xp: 0,
        name: Name,
        lastmine: 0,
        lastregen: 0,
        picks: [true, false, false, false, false, false, false, false, false, false],
        crates: [0, 0, 0, 0],
        en: {
            cooldown: 0,
            fortune: 0,
            luck: 0,
            xp: 0,
        },
        donator: false,
        lb: 0,
        li: 0,
        dim: 0,
        ds: 0,
        mat: 0,
        dims: [true, false],
        tut: 0,
        ar: -1,
    });*/
};
var addPickaxeRoles = function(message, I){
    if(message.channel.type !== 'dm' && (bot.guilds.get(message.guild.id).id).toString() === "550036987772403714"){
      /*if(message.member.roles.find(r => r.name === "Donator") && I.donator === false){
        Message("Donation! :D", "Thank you so much for your donation! I'll give you your stuff now!", message, "3366ee");
        I.pick = 5;
        I.picks[5] = true;
        I.donator = true;
        I.crates[3] ++;
      }*/
      if(I.pick == 0){
          var role = message.guild.roles.find(role => role.name === "Wooden Pickaxe");
          message.member.addRole(role);
      }
      if(I.pick == 1){
          var role = message.guild.roles.find(role => role.name === "Stone Pickaxe");
          message.member.addRole(role);
      }
      if(I.pick == 2){
          var role = message.guild.roles.find(role => role.name === "Iron Pickaxe");
          message.member.addRole(role);
      }
      if(I.pick == 3){
          var role = message.guild.roles.find(role => role.name === "Diamond Pickaxe");
          message.member.addRole(role);
      }
      if(I.lvl >= 5){
          var role = message.guild.roles.find(role => role.name === "Level 5");
          message.member.addRole(role);
      }
      if(I.lvl >= 10){
          var role = message.guild.roles.find(role => role.name === "Level 10");
          message.member.addRole(role);
      }
      if(I.lvl >= 25){
          var role = message.guild.roles.find(role => role.name === "Level 25");
          message.member.addRole(role);
      }
      if(I.lvl >= 50){
          var role = message.guild.roles.find(role => role.name === "Level 50");
          message.member.addRole(role);
      }
      if(I.lvl >= 100){
          var role = message.guild.roles.find(role => role.name === "Level 100");
          message.member.addRole(role);
      }
    }
};
var updateInventory = function(I){
  
};
var calcFortune = function(e, I){
  var f = e[I.pick];
  f = Math.floor(f);
  var donat = 1;
  if(I.donator){donat = 2;}
  if(f === 0) return 1;
  if(f === 1) return (1+Math.floor(Math.random()*2));
  if(f === 2) return 2;
  if(f === 3) return (2+Math.floor(Math.random()*2));
}
var timesXpBoost = function(e, I){
  var f = e[I.pick];
  f = Math.floor(f);
  var donat = 1;
  if(I.donator){donat = 1;}
  if(f === 0){return 1*donat;}
  if(f === 1){return 1.1*donat;}
  if(f === 2){return 1.2*donat;}
  if(f === 3){return 1.3*donat;}
}
var ActiveTrades = [];
var checkIfTraded = function(trader1, trader2){
  for(var i = 0;i < ActiveTrades.length;i ++){
    if(ActiveTrades[i].trader1 === trader1 && ActiveTrades[i].trader2 === trader2){
      return i;
    }
    if(ActiveTrades[i].trader1 === trader2 && ActiveTrades[i].trader2 === trader1){
      return i;
    }
  }
  return -1;
};
var checkIfEnough = function(I, item, amt){
  if(item === "stone" && I.inv.st < amt){
    return false;
  }
  if(item === "iron" && I.inv.ir < amt){
    return false;
  }
  if(item === "diamond" && I.inv.di< amt){
    return false;
  }
  if(item === "gold" && I.inv.go < amt){
    return false;
  }
  if(item === "redstone" && I.inv.re < amt){
    return false;
  }
  if(item === "lapis" && I.inv.la < amt){
    return false;
  }
  if(item === "keplerium" && I.inv.ke < amt){
    return false;
  }
  if(item === "emerald" && I.inv.em < amt){
    return false;
  }
  if(item === "obsidian" && I.inv.ob < amt){
    return false;
  }
  return true;
};
var stone = "<:0e:690701414145458267>";
var iron = "<:0t:690701364300480582>";
var coal = "<:00:690701362937200651>";
var gold = "<:0w:690701364065599618>";
var redstone = "<:0f:690701413961039952>";
var lapis = "<:0m:690701400627347577>";
var diamond = "<:05:690701363377602621>";
var obsidian = "<:0h:690701413851987988>";
var keplerium = "<:0p:690701365034614844>";
var chestore = "<:ac:690701362761302110>";
var emerald = "<:01:690701363780386826>";
var Stone = "<:0d:690701414187532358>";
var Coal = "<:08:690701363080069180>";
var Iron = "<:0u:690701364287897650>";
var Gold = "<:0y:690701363885244477>";
var Redstone = "<:0k:690701413436620826>";
var Lapis = "<:0n:690701400006590563>";
var Diamond = "<:09:690701363029606421>";
var Keplerium = "<:0r:690701364409663518>";
var Emerald = "<:04:690701363411419208>";
var Obsidian = "<:0g:690701413956714556>";
var pickaxes = ["<:0i:690701413705187400>", "<:0b:690701414778798090>", "<:0q:690701364472315944>", "<:07:690701363180470314>", "<:0v:690701364212531220>", "<:0c:690701414380470352>", "<:0l:690701411347988510>","<:0z:690701363809878076>","<:03:690701363533054023>","<:0s:690701364388691978>", "<:0x:690701363973324931>", "<:06:690701363302105158>", "<:02:690701363746701323>", "<:0o:690701365403451443>"];
var air = "<:0a:693880882012094524>";
var air2 = "<:0a:693880882012094524>";
var xps = ["<:xp_0:550744679550025728>", "<:xp_1:550744679327596545>", "<:xp_2:550744679495237643>", "<:xp_3:550744679680049167>", 
        "<:xp_4:550744679776256050>", "<:xp_5:550744679830781967>", 
        "<:xp_6:550744679910473753>", "<:xp_7:550744679562608642>", "<:xp_8:550744679835107340>"];
var xp = "<:xp:550773197398736928>";
var crates = "<:0j:690701413650792448>";
var lootbox = "<:aa:690701362836668527>";
var crecipes = [
  {
    name: "Stone Pickaxe",
    info: "A Regular stone pickaxe, can mine iron",
    pic: pickaxes[1],
    tag: "stone",
    cost1: Stone,
    cost2: 100,
    cost3: Obsidian,
    cost4: 0,
    pickid: 1,
  },
  {
    name: "Iron Pickaxe",
    info: "An iron pickaxe, can mine diamonds and gold",
    pic: pickaxes[2],
    tag: "iron",
    cost1: Iron,
    cost2: 100,
    cost3: Obsidian,
    cost4: 0,
    pickid: 2,
  },
  {
    name: "Diamond Pickaxe",
    info: "A Diamond Pickaxe, can mine lots of things!",
    pic: pickaxes[3],
    tag: "diamond",
    cost1: Diamond,
    cost2: 100,
    cost3: Obsidian,
    cost4: 0,
    pickid: 3,
  },
  {
    name: "Gold Pickaxe",
    info: "A Gold pickaxe can mine redstone and lapis!",
    pic: pickaxes[4],
    tag: "gold",
    cost1: Gold,
    cost2: 100,
    cost3: Obsidian,
    cost4: 0,
    pickid: 4,
  },
  {
    name: "Redstone Pickaxe",
    info: "Just a Redstone Pickaxe",
    pic: pickaxes[5],
    tag: "redstone",
    cost1: Redstone,
    cost2: 100,
    cost3: Obsidian,
    cost4: 0,
    pickid: 5,
  },
  {
    name: "Lapis Pickaxe",
    info: "A Lapis Pickaxe.",
    pic: pickaxes[6],
    tag: "lapis",
    cost1: Lapis,
    cost2: 60,
    cost3: Obsidian,
    cost4: 0,
    pickid: 6,
  },
  {
    name: "Emerald Pickaxe",
    info: "An Emerald Pickaxe",
    pic: pickaxes[7],
    tag: "emerald",
    cost1: Emerald,
    cost2: 60,
    cost3: Obsidian,
    cost4: 0,
    pickid: 7,
  },
  {
    name: "Golem Pickaxe",
    info: "A Very Strong Pickaxe, tons of iron!",
    pic: pickaxes[9],
    tag: "golem",
    cost1: Iron,
    cost2: 600,
    cost3: Obsidian,
    cost4: 16,
    pickid: 9,
  },
  {
    name: "Goldium Pickaxe",
    info: "Easy to find Redstone, Gold and Lapis with this Pick!",
    pic: pickaxes[10],
    tag: "goldium",
    cost1: Gold,
    cost2: 600,
    cost3: Obsidian,
    cost4: 16,
    pickid: 10,
  },
  {
    name: "Diamondite Pickaxe",
    info: "Easy to find Diamonds, Keplerium and Obsidian!",
    pic: pickaxes[11],
    tag: "diamondite",
    cost1: Diamond,
    cost2: 600,
    cost3: Obsidian,
    cost4: 16,
    pickid: 11,
  },
  {
    name: "Emeraldium Pickaxe",
    info: "Find lots of Emeralds and Obsidian!",
    pic: pickaxes[12],
    tag: "emeraldium",
    cost1: Emerald,
    cost2: 600,
    cost3: Obsidian,
    cost4: 16,
    pickid: 12,
  },
  {
    name: "Keplerium Pickaxe",
    info: "An all around strong pickaxe!",
    pic: pickaxes[13],
    tag: "keplerium",
    cost1: Keplerium,
    cost2: 32,
    cost3: Obsidian,
    cost4: 16,
    pickid: 13,
  },
  /*
  {//sure
    name: "Quartz Pickaxe",
    info: "Around the same of a Voter Pickaxe but for the Nether",
    pic: pickaxes[10],
    tag: "quartz",
    cost1: Quartz,
    cost2: 60,
  },
  {
    name: "Pigman Pickaxe",
    info: "Has 50% less cooldown when mining in the nether",
    pic: pickaxes[11],
    tag: "pigman",
    cost1: Gold,
    cost2: 360,
  },
  {
    name: "Blaze Pickaxe",
    info: "You get 50% more xp when mining in the nether",
    pic: pickaxes[1],
    tag: "blaze",
    cost1: BlazeRod,
    cost2: 120,
  },
  {
    name: "Nether Portal",
    info: "Go to the nether! Requires level 10",
    pic: Obsidian,
    tag: "nether",
    cost1: Obsidian,
    cost2: 14,
  },
  {
    name: "Brewing Stand",
    info: "Brew potions to improve your mining experience",
    pic: '<:BrewingStand:604055946926358572>',
    tag: "brewingstand",
    cost1: BlazeRod,
    cost2: 12,
  },*/
];
var emvalue = inv.emvalue || 1;
var investamt = 0;
var nextminerreset = inv.minerreset;
//Functions
var count = 0;
var updatePickaxes = function(I, pick, tomake){
  var alllepickaxes = "";
  for(var i = 0;i < pickaxes.length;i ++){
    if(i === pick){
      alllepickaxes +=tomake;
    }
    else{
      alllepickaxes +=I.picks[i];
    }
  }
  return alllepickaxes;
};
var updateEnchants = function(I, pick, tomake, ench){
  var allleenchs = "";
  for(var i = 0;i < pickaxes.length;i ++){
    if(i === pick){
      allleenchs +=tomake;
    }
    else{
      allleenchs +=ench[i];
    }
  }
  console.log(allleenchs);
  return allleenchs;
};
var TutorialCommand = function(message){
    var yourarray = findYourId(message.author.id);
    if(yourarray == -1){
        makeNewInventory(message);
        yourarray = Invs.length-1;
        console.log("User " + Invs[Invs.length-1].id + " Created!");
    }
    //console.log(message.author.username.toString());
    var I = Invs[yourarray];
    updateInventory(I);
    I.tut = 0;
    Message(`Welcome there ${I.name}!`, `I will walk you thru how to use The Kepler Miner!\nGet started by typing in \`kb!mine r\``, message, "33ee33");
};
var MineCommand = function(message, args){
    count ++;
    var yourarray = findYourId(message.author.id);
    if(yourarray == -1){
        makeNewInventory(message);
        yourarray = Invs.length-1;
        console.log("User " + Invs[Invs.length-1].id + " Created!");
    }
    //console.log(message.author.username.toString());
    var I = Invs[yourarray];
  updateInventory(I);
  if(I.en.eff === 0)waittime = 5*1000;
  if(I.en.eff === 1)waittime = 4.5*1000;
  if(I.en.eff === 2)waittime = 4*1000;
  if(I.en.eff === 3)waittime = 3.5*1000;
  if(I.en.eff === 4)waittime = 3*1000;
  if(I.en.eff === 5)waittime = 2.5*1000;
    if(I.d == ""){createLand(I);}
    if(Date.now() > I.last[0]+waittime){
      I.last[0] = Date.now();
      if((args[0] == "right" || args[0] == "r") && I.pickp[0] < 6){
          I.pickp[0] ++;
      }
      if((args[0] == "left" || args[0] == "l") && I.pickp[0] > 0){
          I.pickp[0] --;
      }
      if((args[0] == "down" || args[0] == "d") && I.pickp[1] < 6){
          I.pickp[1] ++;
      }
      if((args[0] == "up" || args[0] == "u") && I.pickp[1] > 0){
          I.pickp[1] --;
      }
      I.name = message.author.username.toString();
      var m = "";
      for(var i = 0;i < 7;i ++){
          m = m + "\n";
          for(var j = 0;j < 7;j ++){
                if(i === I.pickp[1] && j === I.pickp[0]){
                  m +=pickaxes[I.pick];
                    if(I.d[i*7+j] == "6"){ 
                      I.crates ++;
                      Message("Lootbox!", "You just found a lootbox! Do `kb!lootbox open` to open it!", message, "bb22ff");
                    }
                    if(I.d[i*7+j] == "b"){ I.inv.em +=1*calcFortune(I.en.fortune, I); I.xp+=10*timesXpBoost(I.en.xp, I);I.minerscore+=10;I.sts[12] ++;}
                    if(I.d[i*7+j] == "a"){ I.inv.ob +=1; I.xp+=15*timesXpBoost(I.en.xp, I);I.minerscore+=15;I.sts[13] ++;}
                    if(I.d[i*7+j] == "9"){ I.inv.ke +=1; I.xp+=25*timesXpBoost(I.en.xp, I);I.minerscore+=50;I.sts[11] ++;}
                    if(I.d[i*7+j] == "8"){ I.inv.la +=1*calcFortune(I.en.fortune, I); I.xp+=3*timesXpBoost(I.en.xp, I);I.minerscore+=3;I.sts[10] ++;}
                    if(I.d[i*7+j] == "7"){ I.inv.re +=1*calcFortune(I.en.fortune, I); I.xp+=3*timesXpBoost(I.en.xp, I);I.minerscore+=3;I.sts[9] ++;}
                    if(I.d[i*7+j] == "5"){ I.inv.di +=1*calcFortune(I.en.fortune, I); I.xp+=10*timesXpBoost(I.en.xp, I);I.minerscore+=10;I.sts[8] ++;}
                    if(I.d[i*7+j] == "4"){ I.inv.go +=1*calcFortune(I.en.fortune, I); I.xp+=5*timesXpBoost(I.en.xp, I);I.minerscore+=5;I.sts[7] ++;}
                    if(I.d[i*7+j] == "3"){ I.inv.ir +=1*calcFortune(I.en.fortune, I);I.xp+=3*timesXpBoost(I.en.xp, I);I.minerscore+=3;I.sts[6] ++;}
                    if(I.d[i*7+j] == "2"){ I.inv.co +=1*calcFortune(I.en.fortune, I);I.xp+=1*timesXpBoost(I.en.xp, I);I.minerscore+=2;I.sts[5] ++;}
                    if(I.d[i*7+j] == "1"){ I.inv.st +=1*calcFortune(I.en.fortune, I);I.minerscore+=1;I.sts[4] ++;}  
                    if(I.d[i*7+j] !== "0"){ I.sts[0] ++; }
                    I.d = replaceInString(I.d, i*7+j, "0");
                  }
                else if(I.d[i*7+j] === "b"){
                    m += emerald;
                }
                else if(I.d[i*7+j] === "a"){
                    m += obsidian;
                }
                else if(I.d[i*7+j] === "9"){
                    m += keplerium;
                }
                else if(I.d[i*7+j] === "8"){
                    m += lapis;
                }
                else if(I.d[i*7+j] === "7"){
                    m += redstone;
                }
                else if(I.d[i*7+j] === "6"){
                    m += chestore;
                }
                else if(I.d[i*7+j] === "5"){
                    m += diamond;
                }
                else if(I.d[i*7+j] === "4"){
                    m += gold;
                }
                else if(I.d[i*7+j] === "3"){
                    m += iron;
                }
                else if(I.d[i*7+j] === "2"){
                    m += coal;
                }
                else if(I.d[i*7+j] === "1"){
                    m += stone;
                }
                else if(I.d[i*7+j] === "0"){
                    m += air;
                }
          }
      }
      //console.log(m.length);
      /*let embed = new Commando.RichEmbed()
        .setAuthor(bot.user.username, bot.user.avatarURL)
        .setTitle("**Your Arena**")
        .setDescription(m)
        .setColor("33ee33");*/
      message.channel.send("**" + I.name + "'s Arena:**" + m);
      I.xp = Math.floor(I.xp);
      if(I.tut === 4 && I.inv.st >= 100){
        I.tut = 5;
        Message("It's time!", "You finally have enough stone! It takes 100 to craft a new shiny pickaxe!\nUse the `kb!craft stone` to craft your new shiny stone pickaxe!", message, "33ee33");
      }
      if(I.tut === 2 && I.inv.co >= 1){
        I.tut = 3;
        Message("Coalrific!", "Now that you have some coal, you've also gained some experience. Let's go check your inventory!\nUsage is `kb!inv`.", message, "33ee33");
      }
      if(I.tut === 1){
        I.tut = 2;
        Message("Intresting!", "Alright, go grab some coal over there!\nIf you don't have any coal in your arena, just use `kb!regenland` or `kb!rl`\nto regenerate your arena, you may do this every so often.", message, "33ee33");
      }
      if(I.tut === 0){
        I.tut = 1;
        Message("Great work!", "Nice! You might notice that the r on the end stands for right,\nyou can use other directions as well!\n'r', 'l', 'u' and 'd' are all 'right', 'left', 'up' and 'down' respectively", message, "33ee33");
      }
      if(args[0] === ""){
        message.channel.send("**Don't forget to add a direction at the end in the direction you want to mine!**");
      }
      levelUp(I, message);
      /*var tips = [
          "Join The Kepler Miner Official Server by doing `kb!server`!",
      ];
      if(Math.random()*10 > 8.8){
          message.channel.send("**TIP: **\n" + tips[Math.floor(Math.random()*tips.length)]);
      }*/
      addPickaxeRoles(message, I);
    }
  else{
    Message("Too fast!", "Please wait " + (((I.last[0]+waittime)-Date.now())/1000).toFixed(3) + " Seconds!", message, "ee3333");
  }
    
};
var InvCommand = function(message, args){
  var ID = "";
  var targetUser = "";
  if(message.channel.type === "dm"){
    targetUser = message.author.id;
  }
  else{
    targetUser = message.guild.member(message.mentions.users.first()) || args[0];
  }
  //console.log(targetUser.id + " vs. " + targetUser);
  ID = targetUser.id || targetUser || message.author.id;
    var yourarray = findYourId(ID);
        if(yourarray == -1 && message.author.id === ID){
            makeNewInventory(message);
            yourarray = Invs.length-1;
        }
        else if(yourarray == -1){
          Message("Uh oh!", "This user doesn't exist yet!", message, "ee3333");
          return;
        }
        var I = Invs[yourarray];
        updateInventory(I);
    if(I.lostitems == 0){
      message.channel.send("If you have lost items from a recent rollback on 2019/11/06, you can go to the kepler miner server by doing kb!server and go to the #restore-data channel and follow the instructions there!");
      I.lostitems = 1;
    }
        if(ID === message.author.id){ I.name = message.author.username.toString();}
        var XPP = "";
        for(var i = 0;i < 10;i ++){
            if(I.xp/((100+(I.lvl^3))/10) >= i+1){
                if(i === 0){
                    XPP +=xps[2];
                }
                else if(i === 9){
                    XPP +=xps[8];
                }
                else{
                    XPP +=xps[5];
                }
            }
            else if(I.xp/((100+(I.lvl^3))/10) >= i+0.5){
                if(i === 0){
                    XPP +=xps[1];
                }
                else if(i === 9){
                    XPP +=xps[7];
                }
                else{
                    XPP +=xps[4];
                }
            }
            else{
                if(i === 0){
                    XPP +=xps[0];
                }
                else if(i === 9){
                    XPP +=xps[6];
                }
                else{
                    XPP +=xps[3];
                }
            }
        }
        let testVar = "breep";
        //var overworldStuff = `they have mined:\n ${I.inv.stone}\n ${Coal} ${I.inv.coal}\n ${Iron} ${I.inv.iron}\n ${Gold} ${I.inv.gold}\n ${Diamond} ${I.inv.diamond}\n ${Redstone} ${I.inv.redstone}\n ${Lapis} ${I.inv.lapis}\n ${Keplerium} ${I.inv.keplerium}\n ${emerald} ${I.inv.emerald}`;
        var overworldStuff = Stone + " **" + Math.floor(I.inv.st) + "**\n"; //hi kep
        overworldStuff += Coal + " **" + I.inv.co + "**\n";
        overworldStuff += Iron + " **" + I.inv.ir + "**\n";
        overworldStuff += Gold + " **" + I.inv.go + "**\n";
        overworldStuff += Diamond + " **" + I.inv.di + "**\n";
        overworldStuff += Redstone + " **" + I.inv.re + "**\n";
        overworldStuff += Lapis + " **" + I.inv.la + "**\n";
        overworldStuff += Keplerium + " **" + I.inv.ke + "**\n";
        overworldStuff += Emerald + " **" + I.inv.em + "**\n";
        overworldStuff += Obsidian + " **" + I.inv.ob + "**\n";
        //message.reply();
        var pickss = "";
        for(var i = 0;i < I.picks.length;i ++){
          if(I.picks[i] === "1"){
            pickss +=pickaxes[i];
          }
          else{
            pickss +=air;
          }
        }
        
        let invEmbed = new Commando.RichEmbed() 
            .setTitle(`**${I.name}'s inventory**`)
            .setColor("22ff88")
            .setTimestamp()
            .setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL)
            .addField(`Overworld Items`, overworldStuff, true)
            .addBlankField(false)
            .addField(`Level: ${I.lvl}`, XPP, false)
            .addField(`**THEIR PICKAXES: **`, `${pickss}\n**Do kb!pickaxe [pickaxe] to switch your pickaxe!**`, false)
        
        message.channel.send(invEmbed);
      if(I.tut === 3){
        I.tut = 4;
          Message("Alrighty", "That's a lot of stuff you can get!\nThough currently it seems you can only get coal and stone.\nYou'll want to craft a stone pickaxe!\nI will let you know when you have enough! ;)", message, "33ee33");
      }
        addPickaxeRoles(message, I);
};
var RegenLandCommand = function(message, args){
    var yourarray = findYourId(message.author.id);
    if(yourarray == -1){
        makeNewInventory(message);
        yourarray = Invs.length-1;
    }
    var I = Invs[yourarray];
    updateInventory(I);
    if(I.en.cd[I.pick] === 0){regentime = 120*1000;}
    if(I.en.cd[I.pick] === 1){regentime = 105*1000;}
    if(I.en.cd[I.pick] === 2){regentime = 90*1000;}
    if(I.en.cd[I.pick] === 3){regentime = 75*1000;}
    if(I.en.cd[I.pick] === 4){regentime = 60*1000;}
    if(I.en.cd[I.pick] === 5){regentime = 45*1000;}
    if(I.last[1]+regentime< Date.now()){
      I.last[1] = Date.now();
      I.name = message.author.username.toString();
      createLand(I, I.dim);
      Message("Created land!", "Do the `kb!mine` command to mine in it!", message);
      addPickaxeRoles(message, I);
      I.sts[3] ++;
    }
    else{
      Message("A little too quick!", "Please wait " + (((I.last[1]+regentime)-Date.now())/1000).toFixed(1) + " Seconds!", message, "ee3333");
    }
};
var filename = "./datas.json";
var BackupQuick = function(){
    var inv = {Invs:Invs};
    var data = JSON.stringify(inv);
    fs.writeFile('datas.json', data, (err) => {  
      if (err) throw err;
      console.log('Data written to file! ' + data.length + " Characters long!");
      //console.log(data);
      const rawdata = fs.readFileSync('datas.json');  
      const inv = JSON.parse(rawdata);  
      Invs = inv.Invs;
    });
};
var BackupCommand = function(message, args){
    var inv = {Invs:Invs};
    var data = JSON.stringify(inv);
    var Namee = "data" + Date.now() + ".json";
    Namee = Namee.toString();
    fs.writeFile('datas.json', data, (err) => {  
      if (err) throw err;
      console.log('Data written to file!');
      console.log(data);
      const rawdata = fs.readFileSync('datas.json');  
      const inv = JSON.parse(rawdata);  
      //console.log(inv.Invs);  
      //Message("Backup Success!", "Data has been backed up successfully! There are " + inv.Invs.length + " user datas stored!", message, "ee7733");
      Invs = inv.Invs;
      var myAttachment = new Commando.Attachment("./datas.json", Namee);
      let embed = new Commando.RichEmbed()
            .setAuthor(bot.user.username, bot.user.avatarURL)
            .addField('Backup Success: ' + inv.Invs.length + " User Datas stored!", "Here is your .json file! :D")
            .setColor("22ff88")
            .attachFile(myAttachment)

        message.channel.send(embed);
      //message.channel.send("Here is the .json file!", myAttachment);
      /*for(var i = 0;i < Math.floor(data.length/1000)+1;i ++){
        message.channel.send("```" + data.slice(i*1000, i*1000+1000) + "```");
      }*/
    });
};
var CraftCommand = function(message, args){

    var yourarray = findYourId(message.author.id);
    if(yourarray == -1){
        makeNewInventory(message);
        yourarray = Invs.length-1;
    }
    var I = Invs[yourarray];
  
    updateInventory(I);
    if(I.lostitems == 0){
      message.channel.send("If you have lost items from a recent rollback on 2019/11/06, you can go to the kepler miner server by doing kb!server and go to the #restore-data channel and follow the instructions there!");
      I.lostitems = 1;
    }
    I.name = message.author.username.toString();
  
  if(args[0] === undefined || args[0] === "" || args[0] === "page"){
    var PG = (-1+Math.floor(args[1]))*5 || 0;
    if(PG < 0) PG = 0;
    if(PG > crecipes.length){ PG = 0;}
    var EPG = PG+5;
    if(EPG >= crecipes.length) EPG = crecipes.length;
        var craftingrecipes = "";
        
        for(var i = PG;i < EPG;i ++){
          if(crecipes[i].cost4 !== 0){
            craftingrecipes +=crecipes[i].cost1 + " **" + crecipes[i].cost2 + " + " + crecipes[i].cost3 + "** **" + crecipes[i].cost4 + "** :arrow_forward: " + crecipes[i].pic + " " + crecipes[i].name + " - " + crecipes[i].info + " - Do `kb!craft " + crecipes[i].tag + "`";
          }
          else{
            craftingrecipes +=crecipes[i].cost1 + " **" + crecipes[i].cost2 + "** :arrow_forward: " + crecipes[i].pic + " " + crecipes[i].name + " - " + crecipes[i].info + " - Do `kb!craft " + crecipes[i].tag + "`";
          }
          craftingrecipes +="\n";
        }
        let craftEmbed = new Commando.RichEmbed() 
            .setTitle(`**${I.name}'s inventory**`)
            .setColor("22ff88")
            .setTimestamp()
            .setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL)
            .addField(`Crafting!!`, "You can do `kb!craft <item> to craft that item You may require different materials!", false)
            .addField(`Recipes (Do kb!craft page <pg> to switch pages!):`, craftingrecipes, true);
        message.channel.send(craftEmbed);
    return;
  }
  for(var i = 0;i < crecipes.length;i ++){
    if(crecipes[i].cost4 === 0){
      if(i == 0){ //Stone
        if(I.inv.st >= crecipes[i].cost2 && (args[0] == crecipes[i].pickid || args[0] === crecipes[i].tag) && I.picks[crecipes[i].pickid] === "0"){
          I.pick = crecipes[i].pickid;
          I.inv.st -=crecipes[i].cost2;
          I.picks = updatePickaxes(I, crecipes[i].pickid, "1");
          Message("Crafting Table", "You just got the " + crecipes[i].name + "! Nice work! " + pickaxes[I.pick], message);
          
          if(I.tut === 5){
            I.tut = -1;
            Message("Tada!", "Look at that new shiny pickaxe! (Well now I realized that the pickaxe isn't that shiny)\nTry regenerating your land!" +
                    "You might see a new ore!\nI now think you've got the hang of it! Keep on mining! Hit the leaderboards by using `kb!top`! \nYou can go back to the `kb!help` command and look at the other cool commands we have for example like `kb!villager`! (That command shows you prices of materials to ems!)", message, "33ee33");
          }
        }
        else if((args[0] == Math.floor(i+1) || args[0] === crecipes[i].tag) && I.picks[crecipes[i].pickid] === "0"){
          Message("Crafting Table", "You need " + (crecipes[i].cost2-I.inv.st) + " more " + crecipes[i].cost1, message);
        }
        else if((args[0] == Math.floor(i+1) || args[0] === crecipes[i].tag)){
          Message("Crafting Table", "You own this pickaxe!", message);
        }
      }
      if(i == 1){ //Iron
        if(I.inv.ir >= crecipes[i].cost2 && (args[0] == crecipes[i].pickid || args[0] === crecipes[i].tag) && I.picks[crecipes[i].pickid] === "0"){
          I.pick = crecipes[i].pickid;
          I.inv.ir -=crecipes[i].cost2;
          I.picks = updatePickaxes(I, crecipes[i].pickid, "1");
          Message("Crafting Table", "You just got the " + crecipes[i].name + "! Nice work! " + pickaxes[I.pick], message);
          
        }
        else if((args[0] == Math.floor(i+1) || args[0] === crecipes[i].tag) && I.picks[crecipes[i].pickid] === "0"){Message("Crafting Table", "You need " + (crecipes[i].cost2-I.inv.ir) + " more " + crecipes[i].cost1, message);}
        else if((args[0] == Math.floor(i+1) || args[0] === crecipes[i].tag)){Message("Crafting Table", "You own this pickaxe!", message);}
      }
      if(i == 2){ //Diamond
        if(I.inv.di >= crecipes[i].cost2 && (args[0] == crecipes[i].pickid || args[0] === crecipes[i].tag) && I.picks[crecipes[i].pickid] === "0"){
          I.pick = crecipes[i].pickid;
          I.inv.di -=crecipes[i].cost2;
          I.picks = updatePickaxes(I, crecipes[i].pickid, "1");
          Message("Crafting Table", "You just got the " + crecipes[i].name + "! Nice work! " + pickaxes[I.pick], message);
          
        }
        else if((args[0] == Math.floor(i+1) || args[0] === crecipes[i].tag) && I.picks[crecipes[i].pickid] === "0"){Message("Crafting Table", "You need " + (crecipes[i].cost2-I.inv.di) + " more " + crecipes[i].cost1, message);}
        else if((args[0] == Math.floor(i+1) || args[0] === crecipes[i].tag)){Message("Crafting Table", "You own this pickaxe!", message);}
      }
      if(i == 3){ //Gold
        if(I.inv.go >= crecipes[i].cost2 && (args[0] == crecipes[i].pickid || args[0] === crecipes[i].tag) && I.picks[crecipes[i].pickid] === "0"){
          I.pick = crecipes[i].pickid;
          I.inv.go -=crecipes[i].cost2;
          I.picks = updatePickaxes(I, crecipes[i].pickid, "1");
          Message("Crafting Table", "You just got the " + crecipes[i].name + "! Nice work! " + pickaxes[I.pick], message);
          
        }
        else if((args[0] == Math.floor(i+1) || args[0] === crecipes[i].tag) && I.picks[crecipes[i].pickid] === "0"){Message("Crafting Table", "You need " + (crecipes[i].cost2-I.inv.go) + " more " + crecipes[i].cost1, message);}
        else if((args[0] == Math.floor(i+1) || args[0] === crecipes[i].tag)){Message("Crafting Table", "You own this pickaxe!", message);}
      }
      if(i == 4){ //Redstone
        if(I.inv.re >= crecipes[i].cost2 && (args[0] == crecipes[i].pickid || args[0] === crecipes[i].tag) && I.picks[crecipes[i].pickid] === "0"){
          I.pick = crecipes[i].pickid;
          I.inv.re -=crecipes[i].cost2;
          I.picks = updatePickaxes(I, crecipes[i].pickid, "1");
          Message("Crafting Table", "You just got the " + crecipes[i].name + "! Nice work! " + pickaxes[I.pick], message);
          
        }
        else if((args[0] == Math.floor(i+1) || args[0] === crecipes[i].tag) && I.picks[crecipes[i].pickid] === "0"){Message("Crafting Table", "You need " + (crecipes[i].cost2-I.inv.re) + " more " + crecipes[i].cost1, message);}
        else if((args[0] == Math.floor(i+1) || args[0] === crecipes[i].tag)){Message("Crafting Table", "You own this pickaxe!", message);}
      }
      if(i == 5){ //Lapis
        if(I.inv.la >= crecipes[i].cost2 && (args[0] == crecipes[i].pickid || args[0] === crecipes[i].tag) && I.picks[crecipes[i].pickid] === "0"){
          I.pick = crecipes[i].pickid;
          I.inv.la -=crecipes[i].cost2;
          I.picks = updatePickaxes(I, crecipes[i].pickid, "1");
          Message("Crafting Table", "You just got the " + crecipes[i].name + "! Nice work! " + pickaxes[I.pick], message);
          
        }
        else if((args[0] == Math.floor(i+1) || args[0] === crecipes[i].tag) && I.picks[crecipes[i].pickid] === "0"){Message("Crafting Table", "You need " + (crecipes[i].cost2-I.inv.la) + " more " + crecipes[i].cost1, message);}
        else if((args[0] == Math.floor(i+1) || args[0] === crecipes[i].tag)){Message("Crafting Table", "You own this pickaxe!", message);}
      }
      if(i == 6){ //Emerald
        if(I.inv.em >= crecipes[i].cost2 && (args[0] == crecipes[i].pickid || args[0] === crecipes[i].tag) && I.picks[crecipes[i].pickid] === "0"){
          I.pick = crecipes[i].pickid;
          I.inv.em -=crecipes[i].cost2;
          I.picks = updatePickaxes(I, crecipes[i].pickid, "1");
          Message("Crafting Table", "You just got the " + crecipes[i].name + "! Nice work! " + pickaxes[I.pick], message);
          
        }
        else if((args[0] == Math.floor(i+1) || args[0] === crecipes[i].tag) && I.picks[crecipes[i].pickid] === "0"){Message("Crafting Table", "You need " + (crecipes[i].cost2-I.inv.em) + " more " + crecipes[i].cost1, message);}
        else if((args[0] == Math.floor(i+1) || args[0] === crecipes[i].tag)){Message("Crafting Table", "You own this pickaxe!", message);}
      }
    }
    else{
      
      if(i == 7){ //Golem
        if(I.inv.ir >= crecipes[i].cost2 && I.inv.ob >= crecipes[i].cost4 &&(args[0] == crecipes[i].pickid || args[0] === crecipes[i].tag) && I.picks[crecipes[i].pickid] === "0"){
          I.pick = crecipes[i].pickid;
          I.inv.ir -=crecipes[i].cost2;
          I.inv.ob -=crecipes[i].cost4;
          I.picks = updatePickaxes(I, crecipes[i].pickid, "1");
          Message("Crafting Table", "You just got the " + crecipes[i].name + "! Nice work! " + pickaxes[I.pick], message);
          
        }
        else if((args[0] == Math.floor(i+1) || args[0] === crecipes[i].tag) && I.picks[crecipes[i].pickid] === "0" && I.inv.ir >= crecipes[i].cost2 && I.inv.ob < crecipes[i].cost4){Message("Crafting Table", "You need " + (crecipes[i].cost4-I.inv.ob) + " more " + crecipes[i].cost3, message);}
        else if((args[0] == Math.floor(i+1) || args[0] === crecipes[i].tag) && I.picks[crecipes[i].pickid] === "0" && I.inv.ir < crecipes[i].cost2 && I.inv.ob >= crecipes[i].cost4){Message("Crafting Table", "You need " + (crecipes[i].cost2-I.inv.ir) + " more " + crecipes[i].cost1, message);}
        else if((args[0] == Math.floor(i+1) || args[0] === crecipes[i].tag) && I.picks[crecipes[i].pickid] === "0" && I.inv.ir < crecipes[i].cost2 && I.inv.ob < crecipes[i].cost4){Message("Crafting Table", "You need " + (crecipes[i].cost4-I.inv.ob) + " more " + crecipes[i].cost3 + " and " + (crecipes[i].cost2-I.inv.ir) + " more " + crecipes[i].cost1, message);}
        else if((args[0] == Math.floor(i+1) || args[0] === crecipes[i].tag)){Message("Crafting Table", "You own this pickaxe!", message);}
      }
      if(i == 8){ //Goldium
        if(I.inv.go >= crecipes[i].cost2 && I.inv.ob >= crecipes[i].cost4 &&(args[0] == crecipes[i].pickid || args[0] === crecipes[i].tag) && I.picks[crecipes[i].pickid] === "0"){
          I.pick = crecipes[i].pickid;
          I.inv.go -=crecipes[i].cost2;
          I.inv.ob -=crecipes[i].cost4;
          I.picks = updatePickaxes(I, crecipes[i].pickid, "1");
          Message("Crafting Table", "You just got the " + crecipes[i].name + "! Nice work! " + pickaxes[I.pick], message);
          
        }
        else if((args[0] == Math.floor(i+1) || args[0] === crecipes[i].tag) && I.picks[crecipes[i].pickid] === "0" && I.inv.go >= crecipes[i].cost2 && I.inv.ob < crecipes[i].cost4){Message("Crafting Table", "You need " + (crecipes[i].cost4-I.inv.ob) + " more " + crecipes[i].cost3, message);}
        else if((args[0] == Math.floor(i+1) || args[0] === crecipes[i].tag) && I.picks[crecipes[i].pickid] === "0" && I.inv.go < crecipes[i].cost2 && I.inv.ob >= crecipes[i].cost4){Message("Crafting Table", "You need " + (crecipes[i].cost2-I.inv.go) + " more " + crecipes[i].cost1, message);}
        else if((args[0] == Math.floor(i+1) || args[0] === crecipes[i].tag) && I.picks[crecipes[i].pickid] === "0" && I.inv.go < crecipes[i].cost2 && I.inv.ob < crecipes[i].cost4){Message("Crafting Table", "You need " + (crecipes[i].cost4-I.inv.ob) + " more " + crecipes[i].cost3 + " and " + (crecipes[i].cost2-I.inv.go) + " more " + crecipes[i].cost1, message);}
        else if((args[0] == Math.floor(i+1) || args[0] === crecipes[i].tag)){Message("Crafting Table", "You own this pickaxe!", message);}
      }
      if(i == 9){ //Diamondite
        if(I.inv.di >= crecipes[i].cost2 && I.inv.ob >= crecipes[i].cost4 &&(args[0] == crecipes[i].pickid || args[0] === crecipes[i].tag) && I.picks[crecipes[i].pickid] === "0"){
          I.pick = crecipes[i].pickid;
          I.inv.di -=crecipes[i].cost2;
          I.inv.ob -=crecipes[i].cost4;
          I.picks = updatePickaxes(I, crecipes[i].pickid, "1");
          Message("Crafting Table", "You just got the " + crecipes[i].name + "! Nice work! " + pickaxes[I.pick], message);
          
        }
        else if((args[0] == Math.floor(i+1) || args[0] === crecipes[i].tag) && I.picks[crecipes[i].pickid] === "0" && I.inv.di >= crecipes[i].cost2 && I.inv.ob < crecipes[i].cost4){Message("Crafting Table", "You need " + (crecipes[i].cost4-I.inv.ob) + " more " + crecipes[i].cost3, message);}
        else if((args[0] == Math.floor(i+1) || args[0] === crecipes[i].tag) && I.picks[crecipes[i].pickid] === "0" && I.inv.di < crecipes[i].cost2 && I.inv.ob >= crecipes[i].cost4){Message("Crafting Table", "You need " + (crecipes[i].cost2-I.inv.di) + " more " + crecipes[i].cost1, message);}
        else if((args[0] == Math.floor(i+1) || args[0] === crecipes[i].tag) && I.picks[crecipes[i].pickid] === "0" && I.inv.di < crecipes[i].cost2 && I.inv.ob < crecipes[i].cost4){Message("Crafting Table", "You need " + (crecipes[i].cost4-I.inv.ob) + " more " + crecipes[i].cost3 + " and " + (crecipes[i].cost2-I.inv.di) + " more " + crecipes[i].cost1, message);}
        else if((args[0] == Math.floor(i+1) || args[0] === crecipes[i].tag)){Message("Crafting Table", "You own this pickaxe!", message);}
      }
      if(i == 10){ //Emeraldium
        if(I.inv.em >= crecipes[i].cost2 && I.inv.ob >= crecipes[i].cost4 &&(args[0] == crecipes[i].pickid || args[0] === crecipes[i].tag) && I.picks[crecipes[i].pickid] === "0"){
          I.pick = crecipes[i].pickid;
          I.inv.em -=crecipes[i].cost2;
          I.inv.ob -=crecipes[i].cost4;
          I.picks = updatePickaxes(I, crecipes[i].pickid, "1");
          Message("Crafting Table", "You just got the " + crecipes[i].name + "! Nice work! " + pickaxes[I.pick], message);
          
        }
        else if((args[0] == Math.floor(i+1) || args[0] === crecipes[i].tag) && I.picks[crecipes[i].pickid] === "0" && I.inv.em >= crecipes[i].cost2 && I.inv.ob < crecipes[i].cost4){Message("Crafting Table", "You need " + (crecipes[i].cost4-I.inv.ob) + " more " + crecipes[i].cost3, message);}
        else if((args[0] == Math.floor(i+1) || args[0] === crecipes[i].tag) && I.picks[crecipes[i].pickid] === "0" && I.inv.em < crecipes[i].cost2 && I.inv.ob >= crecipes[i].cost4){Message("Crafting Table", "You need " + (crecipes[i].cost2-I.inv.em) + " more " + crecipes[i].cost1, message);}
        else if((args[0] == Math.floor(i+1) || args[0] === crecipes[i].tag) && I.picks[crecipes[i].pickid] === "0" && I.inv.em < crecipes[i].cost2 && I.inv.ob < crecipes[i].cost4){Message("Crafting Table", "You need " + (crecipes[i].cost4-I.inv.ob) + " more " + crecipes[i].cost3 + " and " + (crecipes[i].cost2-I.inv.em) + " more " + crecipes[i].cost1, message);}
        else if((args[0] == Math.floor(i+1) || args[0] === crecipes[i].tag)){Message("Crafting Table", "You own this pickaxe!", message);}
      }
      if(i == 11){ //Keplerium
        if(I.inv.ke >= crecipes[i].cost2 && I.inv.ob >= crecipes[i].cost4 &&(args[0] == crecipes[i].pickid || args[0] === crecipes[i].tag) && I.picks[crecipes[i].pickid] === "0"){
          I.pick = crecipes[i].pickid;
          I.inv.ke -=crecipes[i].cost2;
          I.inv.ob -=crecipes[i].cost4;
          I.picks = updatePickaxes(I, crecipes[i].pickid, "1");
          Message("Crafting Table", "You just got the " + crecipes[i].name + "! Nice work! " + pickaxes[I.pick], message);
          
        }
        else if((args[0] == Math.floor(i+1) || args[0] === crecipes[i].tag) && I.picks[crecipes[i].pickid] === "0" && I.inv.ke >= crecipes[i].cost2 && I.inv.ob < crecipes[i].cost4){Message("Crafting Table", "You need " + (crecipes[i].cost4-I.inv.ob) + " more " + crecipes[i].cost3, message);}
        else if((args[0] == Math.floor(i+1) || args[0] === crecipes[i].tag) && I.picks[crecipes[i].pickid] === "0" && I.inv.ke < crecipes[i].cost2 && I.inv.ob >= crecipes[i].cost4){Message("Crafting Table", "You need " + (crecipes[i].cost2-I.inv.ke) + " more " + crecipes[i].cost1, message);}
        else if((args[0] == Math.floor(i+1) || args[0] === crecipes[i].tag) && I.picks[crecipes[i].pickid] === "0" && I.inv.ke < crecipes[i].cost2 && I.inv.ob < crecipes[i].cost4){Message("Crafting Table", "You need " + (crecipes[i].cost4-I.inv.ob) + " more " + crecipes[i].cost3 + " and " + (crecipes[i].cost2-I.inv.ke) + " more " + crecipes[i].cost1, message);}
        else if((args[0] == Math.floor(i+1) || args[0] === crecipes[i].tag)){Message("Crafting Table", "You own this pickaxe!", message);}
      }
    }
  }
    addPickaxeRoles(message, I);
};

/** ARENAS **/
/*var MultiMineCommand = function(message, args){
    var yourarray = findYourId(message.author.id);
    if(yourarray == -1){
        makeNewInventory(message);
        yourarray = Invs.length-1;
        console.log("User " + Invs[Invs.length-1].id + " Created!");
    }
    var I = Invs[yourarray];
  
    updateInventory(I);
    if(I.lostitems == 0){
      message.channel.send("If you have lost items from a recent rollback on 2019/11/06, you can go to the kepler miner server by doing kb!server and go to the #restore-data channel and follow the instructions there!");
      I.lostitems = 1;
    }
    if(I.dim !== 0){
      Message("Uh oh!", "You must be in the overworld dimension! use `kb!dimension overworld` to return!", message, "ee3333");
      return;
    }
    if(I.ar === -1){
      Message("Uh oh!", "You have to join an arena first! Use `kb!arena join <arenaid>`", message, "ee3333");
      return;
    }
    if(Date.now() > I.lastmine+waittime){=
      I.name = message.author.username.toString();
      var AR = Arenas[I.ar];
      AR.lastmine = Date.now();
      var ardata = AR.data;
      if(ardata == "" || args[0] == "regenland" || args[0] === "rl"){
        if(args[0] == "recreate" && AR.lastregen+180000 < Date.now()){
          AR.lastregen = Date.now();
          AR.data = createMultiLand(AR.minpick);
        }
        else if(ardata != ""){ 
          Message("Too fast!", "Please wait " + (((AR.lastregen+180000)-Date.now())/1000).toFixed(1) + " Seconds!");
        }
        else if(ardata == ""){
          AR.lastregen = Date.now();
          AR.data = createMultiLand(AR.minpick);
        }
      }
      var ardata = AR.data;
      if((args[0] == "right" || args[0] == "r") && I.mp.x < 7){
          I.mp.x ++;
      }
      if((args[0] == "left" || args[0] == "l") && I.mp.x > 0){
          I.mp.x --;
      }
      if((args[0] == "down" || args[0] == "d") && I.mp.y < 7){
          I.mp.y ++;
      }
      if((args[0] == "up" || args[0] == "u") && I.mp.y > 0){
          I.mp.y --;
      }
      var XPBOOST = 0.9+(amtInArena(AR.id)/10);
      var m = `\n**${AR.name} Arena - XP Boost: ${XPBOOST}x**`;
      for(var i = 0;i < 8;i ++){
          m = m + "\n";
          for(var j = 0;j < 8;j ++){
              if(i === I.mp.y && j === I.mp.x){
                  m +=pickaxes[I.pick];
                  if(ardata[i*8+j] == "6"){ 
                      var randit = Math.floor(Math.random()*5);
                      if(randit == 0){
                          I.inv.stone +=20;
                          message.reply("You got 20 stone!");
                      }
                      if(randit == 1){
                          I.inv.coal +=20;
                          message.reply("You got 20 coal!");
                      }
                      if(randit == 2){
                          I.inv.iron +=10;
                          message.reply("You got 10 iron!");
                      }
                      if(randit == 3){
                          I.inv.gold +=5;
                          message.reply("You got 5 gold!");
                      }
                      if(randit == 4){
                          I.inv.diamond +=5;
                          message.reply("You got 5 diamonds!");
                      }
                  }
                  if(ardata[i*7+j] == "a"){ I.inv.obsidian +=1; I.xp+=5*timesXpBoost(I.en.xp, I)*XPBOOST;}
                  if(ardata[i*8+j] == "9"){ I.inv.keplerium +=1; I.xp+=50*timesXpBoost(I.en.xp, I)*XPBOOST;}
                  if(ardata[i*8+j] == "8"){ I.inv.lapis +=1*calcFortune(I.en.fortune, I); I.xp+=3*timesXpBoost(I.en.xp, I)*XPBOOST;}
                  if(ardata[i*8+j] == "7"){ I.inv.redstone +=1*calcFortune(I.en.fortune, I); I.xp+=3*timesXpBoost(I.en.xp, I)*XPBOOST;}
                  if(ardata[i*8+j] == "5"){ I.inv.diamond +=1*calcFortune(I.en.fortune, I); I.xp+=10*timesXpBoost(I.en.xp, I)*XPBOOST;}
                  if(ardata[i*8+j] == "4"){ I.inv.gold +=1*calcFortune(I.en.fortune, I); I.xp+=5*timesXpBoost(I.en.xp, I)*XPBOOST;}
                  if(ardata[i*8+j] == "3"){ I.inv.iron +=1*calcFortune(I.en.fortune, I);I.xp+=3*timesXpBoost(I.en.xp, I)*XPBOOST;}
                  if(ardata[i*8+j] == "2"){ I.inv.coal +=1*calcFortune(I.en.fortune, I);I.xp+=1*timesXpBoost(I.en.xp, I)*XPBOOST;}
                  if(ardata[i*8+j] == "1"){ I.inv.stone +=1*calcFortune(I.en.fortune, I);}
                  I.xp = Math.floor(I.xp);
                  AR.data = replaceInString(AR.data, i*8+j, "0");
              }
              else if(ardata[i*8+j] === "a"){
                  m += obsidian;
              }
              else if(ardata[i*8+j] === "9"){
                  m += keplerium;
              }
              else if(ardata[i*8+j] === "8"){
                  m += lapis;
              }
              else if(ardata[i*8+j] === "7"){
                  m += redstone;
              }
              else if(ardata[i*8+j] === "6"){
                  m += random;
              }
              else if(ardata[i*8+j] === "5"){
                  m += diamond;
              }
              else if(ardata[i*8+j] === "4"){
                  m += gold;
              }
              else if(ardata[i*8+j] === "3"){
                  m += iron;
              }
              else if(ardata[i*8+j] === "2"){
                  m += coal;
              }
              else if(ardata[i*8+j] === "1"){
                  m += stone;
              }
              else if(ardata[i*8+j] === "0"){
                  var doair = true;
                  for(var k = 0;k < Invs.length;k ++){
                      if(yourarray !== k && doair){
                          var K = Invs[k];
                          updateInventory(K);
                          if(K.mp.y === i && K.mp.x === j && K.ar === AR.id){
                              m +=pickaxes[K.pick];
                              doair = false;
                          }
                      }
                  }
                  if(doair){m += air;}
              }
          }
      }
      message.channel.send(m);
      if(args[0] === ""){
        message.channel.send("**Don't forget to add a direction at the end in the direction you want to mine!**");
      }
      if(I.xp >= I.level*10){levelUp(I, message);}
      addPickaxeRoles(message, I);
      //console.log(m.length);
    }
  else{
    Message("Too fast!", "Please wait " + (((I.lastmine+waittime)-Date.now())/1000).toFixed(3) + " Seconds!", message, "ee3333");
  }
    
};*/
/*var amtInArena = function(arenaid){
  var amt = 0;
  for(var a = 0;a < Invs.length;a ++){
    if(Invs[a].ar === arenaid){
      amt ++;
    }
  }
  return amt;
};*/
/*var ArenaCommand = function(message, args){
    var yourarray = findYourId(message.author.id);
    if(yourarray == -1){
        makeNewInventory(message);
        yourarray = Invs.length-1;
        console.log("User " + Invs[Invs.length-1].id + " Created!");
    }
    var I = Invs[yourarray];
    updateInventory(I);
    if(I.lostitems == 0){
      message.channel.send("If you have lost items from a recent rollback on 2019/11/06, you can go to the kepler miner server by doing kb!server and go to the #restore-data channel and follow the instructions there!");
      I.lostitems = 1;
    }
  
  
    if(args[0] === undefined || args[0] === ""){
      Message("Usage", "`kb!arena create <minimumpickaxe> <private or public> <name> [password]`\nCreate an arena, private people will have to enter with a password.\n`kb!arena join <id> [password]`\nJoin an existing arena! Note that if the arena is private you will have to enter in a password.\n`kb!arena delete <id>`\nDelete one of your arenas, note this will only work if it's yours. Anyone who was in the arena will be kicked out.\n`kb!arena list <page>`\nView some existing arenas!\n", message, "eeee33");
      return;
    }
  
    //Create an arena.
    if(args[0] === "create"){ //kb!arena create <minimumpickaxe> <private or public> <name> [password]
      
      //Pickaxes
      var minP = -1;
      if(args[1] === "wooden" || args[1] === "wood" || args[1] === 0){
        minP = 0;
      }
      if(args[1] === "stone" || args[1] === 1){
        minP = 1;
      }
      if(args[1] === "iron" || args[1] === 2){
        minP = 2;
      }
      if(args[1] === "diamond" || args[1] === 3){
        minP = 3;
      }
      if(args[1] === "keplerium" || args[1] === 9){
        minP = 9;
      }
      if(minP === -1){
        Message("Uh oh!", "Please specify the minimum pickaxe!\nFor example, stone would be the minimum pickaxe.\nSo wooden pickaxes couldn't join, but stone and higher could.", message, "ee3333");
        return;
      }
      
      //Private or Public
      var ispublic = -1;
      if(args[2] === "private"){
        ispublic = 0;
      }
      if(args[2] === "public"){
        ispublic = 1;
      }
      if(ispublic === -1){
        Message("Uh oh!", "Please specify if your arena will be public or private! If it's public anyone can join, but if it's private then they will need a password.", message, "ee3333");
        return;
      }
      
      //name
      var name = args[3];
      if(!args[3]){
        Message("Uh oh!", "You'll need a one word name! \"Keplermine\" is allowed but \"Keplers Mine\" isn't. However \"Keplers_Mine\" will work! :)", message, "ee3333");
        return;
      }
      if(args[3].length > 14){
        Message("Uh oh!", "Your Name is too long! 14 characters max!", message, "ee3333");
        return;
      }
      for(var i=0;i<profanities.length;i++) {
        if(name.includes(profanities[i])) return Message("Uh oh!", "It looks like you may have used an explitive for your name! Please try again!", message, "ee3333");
      }
      
      //password
      var password = "";
      if(ispublic === 0){
        if(args[4] === "" || args[4] === undefined){
          Message("Uh oh!", "Since this is a private arena you're making, you'll need a password! No spaces of course!", message, "ee3333");
          return;
        }
        password = args[4];
      }
      
      //lets create the arena now yahoo
      var yourarenas = 0;
      for(var i = 0;i < Arenas.length;i ++){
        if(Arenas[i].owner === I.id && I.donator === false){
          Message("Uh oh!", "Only Donators can create multiple arenas! Delete one of your older ones!", message, "ee3333");
          yourarenas ++;
          return;
        }
      }
      if(yourarenas > 8 && I.donator){
          Message("Uh oh!", "Donators can have a maximum of 8 arenas! Delete one of your older ones!", message, "ee3333");
      }
      var ArenaId = 0;
      for(var j = 0;j < 2;j ++){
        for(var i = 0;i < Arenas.length;i ++){
          if(Arenas[i].id === ArenaId){
            ArenaId ++;
          }
        }
      }
      Arenas.push({
        id: ArenaId,
        minpick: minP,
        ispublic: ispublic,
        name: name,
        password: password,
        owner: message.author.id,
        lastmine: Date.now(),
        lastregen: Date.now(),
        data: createMultiLand(minP),
      });
      I.ar = Arenas.length-1;
      if(ispublic === 1){ //public arena.
        Message("Success!", `You've created a new arena called ${name}! The ID is ${ArenaId}`, message, "33ee33");
      }
      if(ispublic === 0){ //private arena.
        bot.users.get(message.author.id).send("Your password: " + password);
        message.delete(1);
        Message("Success!", `You've created a new arena called ${name}! I've DMed you the password so others cannot see! The ID is ${ArenaId}`, message, "33ee33");
        return; //ok
      }//one sec
      //in #kepler-bot-testing and in the console
        
    }
  //join an arena
  if(args[0] === "join"){ //kb!arena join <id> [password]
    if(args[1] === undefined || args[1] === ""){
      Message("Uh oh!", "Please specify an ID! Must be a valid number!", message, "ee3333");
      return;
    }
    if(Math.floor(args[1]) < 0 || Math.floor(args[1]) >= Arenas.length || isNaN(Math.floor(parseInt(args[1])))){
      Message("Uh oh!", "Please specify an ID! Must be a valid number!", message, "ee3333");
      return;
    }
    var tarena = Arenas[Math.floor(args[1])];
    if(tarena.ispublic === 0 && args[2] !== tarena.password){
      Message("Wrong!", "That's not the right password!", message, "ee3333");
      return;
    }
    if(I.pick < tarena.minpick){
      Message("Uh oh!", "You'll need a higher pickaxe!", message, "ee3333");
      return;
    }
    I.ar = Math.floor(args[1]);
    message.delete(1);
    Message("Joined!", `You've joined ${tarena.name}`, message, "33ee33");
  }
  
  if(args[0] === "delete"){
    if(args[1] === undefined || args[1] === ""){
      Message("Uh oh!", "Please specify an ID! Must be a valid number!", message, "ee3333");
      return;
    }
    if(Math.floor(args[1]) < 0 || Math.floor(args[1]) >= Arenas.length || isNaN(Math.floor(parseInt(args[1])))){
      Message("Uh oh!", "Please specify an ID! Must be a valid number!", message, "ee3333");
      return;
    }
    var tarena = Arenas[Math.floor(args[1])];
    if(tarena.owner !== message.author.id){
      Message("Uh oh!", "You don't own this arena which means you cannot delete it!", message, "ee3333");
      return;
    }
    const oldname = tarena.name;
    for(var i = 0;i < Invs.length;i ++){
      updateInventory(Invs[i]);
      if(Invs[i].ar === Math.floor(args[1])){
        Invs[i].ar = -1;
      }
    }
    Arenas.splice(Math.floor(args[1]), 1);
    Message("Successfully deleted!", `You've deleted ${oldname}`, message, "33ee33");
  }
  if(args[0] === "list"){
    var PG = 0;
    if(args[1] !== undefined && args[1] !== "" && !isNaN(Math.floor(parseInt(args[1]))) && Math.floor(args[1]) >= 0 && Math.floor(args[1]) <= Math.floor(Arenas.length/5)){
      PG = Math.floor(args[1]);
    }
    var stpg = PG*5;
    var edpg = PG*5 + 5;
    if(edpg >= Arenas.length){
      edpg = Arenas.length;
    }
    var Mm = "";
    for(var i = stpg;i < edpg;i ++){
      var timescale = "s";
      var timelastmined = Math.floor((Date.now()-Arenas[i].lastmine)/1000);
      if(timelastmined > 120){
        timescale = "m";
        timelastmined = Math.floor(timelastmined/60);
      }
      if(timelastmined > 120){
        timescale = "h";
        timelastmined = Math.floor(timelastmined/60);
      }
      if(timelastmined > 48){
        timescale = "d";
        timelastmined = Math.floor(timelastmined/24);
      }
      Mm +=`ID ${Arenas[i].id}: **${Arenas[i].name}** - Created by: **${Invs[findYourId(Arenas[i].owner)].name}**\n**${amtInArena(Arenas[i].id)}** Recent Miners here | Last Mine: **${timelastmined + timescale} ago**\nMinimum Pickaxe: **${(Arenas[i].minpick === 0) ? "Wooden" : (Arenas[i].minpick === 1) ? "Stone" : (Arenas[i].minpick === 2) ? "Iron" : (Arenas[i].minpick === 3) ? "Diamond" : "Keplerium"}**\n`;
    }
    Message(`Arenas - Page ${1+PG}/${1+Math.floor(Arenas.length/10)}`, Mm, message, "ee3333");
  }
  //console.log(Arenas);
};*/
/*var resetArenas = function(message){
  Arenas = [];
  console.log(Arenas);
  Message("Reset Arenas!", "All Arenas Reset :/", message);
};*/
//More Commands yeet
var TopListCommand = function(message, args){
    
    var yourarray = findYourId(message.author.id);
    if(yourarray == -1){
        makeNewInventory(message);
        yourarray = Invs.length-1;
    }
    var I = Invs[yourarray];
  
    updateInventory(I);
    I.name = message.author.username.toString();
    
    var thepage = Math.floor(args[1]-1) || 0;
    thepage = thepage * 10;
    if(thepage > Invs.length){
      thepage = 0;
    }
  
    TopInvs = [];
    for(var i = 0;i < Invs.length;i ++){
        TopInvs.push(Invs[i]);
    }
    if(args[0] === "levels" || args[0] == NaN || args[0] == "" || args[0] == undefined){ TopInvs.sort(function(a,b){return b.lvl-a.lvl;});}
    else if(args[0] === "minerscore"){ TopInvs.sort(function(a,b){return b.minerscore-a.minerscore;});}
    else if(args[0] === "emerald"){ TopInvs.sort(function(a,b){return b.sts[12]-a.sts[12];});}
    else if(args[0] === "obsidian"){ TopInvs.sort(function(a,b){return b.sts[13]-a.sts[13];});}
    else if(args[0] === "keplerium"){ TopInvs.sort(function(a,b){return b.sts[11]-a.sts[11];});}
    else if(args[0] === "lapis"){ TopInvs.sort(function(a,b){return b.sts[10]-a.sts[10];});}
    else if(args[0] === "redstone"){ TopInvs.sort(function(a,b){return b.sts[9]-a.sts[9];});}
    else if(args[0] === "diamond"){ TopInvs.sort(function(a,b){return b.sts[8]-a.sts[8];});}
    else if(args[0] === "gold"){ TopInvs.sort(function(a,b){return b.sts[7]-a.sts[7];});}
    else if(args[0] === "iron"){ TopInvs.sort(function(a,b){return b.sts[6]-a.sts[6];});}
    else if(args[0] === "coal"){ TopInvs.sort(function(a,b){return b.sts[5]-a.sts[5];});}
    else if(args[0] === "stone"){ TopInvs.sort(function(a,b){return b.sts[4]-a.sts[4];});}
    else if(args[0] === "regenland"){ TopInvs.sort(function(a,b){return b.sts[3]-a.sts[3];});}
    else if(args[0] === "enchants"){ TopInvs.sort(function(a,b){return b.sts[2]-a.sts[2];});}
    else if(args[0] === "lootbox"){ TopInvs.sort(function(a,b){return b.sts[1]-a.sts[1];});}
    else if(args[0] === "mined"){ TopInvs.sort(function(a,b){return b.sts[0]-a.sts[0];});}
    var ms = "";
    var MAX = thepage+10;
    if(MAX > TopInvs.length){
      MAX = TopInvs.length;
    }
    for(var i = thepage;i < MAX;i ++){
      if(TopInvs[i].minerscore === undefined){ TopInvs[i].minerscore = 0;}
        ms +=(i+1) + ". " + pickaxes[TopInvs[i].pick];
        ms +=TopInvs[i].name;
        //ms +=tokenToUser(TopInvs[i].id);
        //console.log(tokenToUser(TopInvs[i].id));
        if(args[0] === "emerald"){ ms +=" - " + Emerald + " " + TopInvs[i].sts[12]+ "\n";}
        else if(args[0] === "obsidian"){ ms +=" - " + Obsidian + " " + TopInvs[i].sts[13]+ "\n";}
        else if(args[0] === "keplerium"){ ms +=" - " + Keplerium + " " + TopInvs[i].sts[11]+ "\n";}
        else if(args[0] === "lapis"){ ms +=" - " + Lapis + " " + TopInvs[i].sts[10]+ "\n";}
        else if(args[0] === "redstone"){ ms +=" - " + Redstone + " " + TopInvs[i].sts[9] + "\n";}
        else if(args[0] === "diamond"){ ms +=" - " + Diamond + " " + TopInvs[i].sts[8]+ "\n";}
        else if(args[0] === "gold"){ ms +=" - " + Gold + " " + TopInvs[i].sts[7] + "\n";}
        else if(args[0] === "iron"){ ms +=" - " + Iron + " " + TopInvs[i].sts[6] + "\n";}
        else if(args[0] === "coal"){ ms +=" - " + Coal + " " + TopInvs[i].sts[5] + "\n";}
        else if(args[0] === "stone"){ ms +=" - " + Stone + " " + TopInvs[i].sts[4] + "\n";}
        else if(args[0] === "regenland"){ ms +=" - " + TopInvs[i].sts[3] + " times\n";}
        else if(args[0] === "enchants"){ ms +=" - " + Lapis + " " + TopInvs[i].sts[2] + "\n";}
        else if(args[0] === "lootbox"){ ms +=" - " + lootbox + " " + TopInvs[i].sts[1] + "\n";}
        else if(args[0] === "mined"){ ms +=" - " + TopInvs[i].sts[0] + "\n";}
        else if(args[0] === "minerscore"){ms +=" - " + TopInvs[i].minerscore + "\n";}
        else{ms +=" - Level " + TopInvs[i].lvl + "\n";}
    }
    if(1+findYourPlace(message.author.id) > 10){ 
      if(args[0] === "minerscore"){
        ms +="...\n" + (1+findYourPlace(message.author.id)) + ". " + TopInvs[findYourPlace(message.author.id)].name + " - " + TopInvs[findYourPlace(message.author.id)].minerscore;
      }
      else if(args[0] === "emeralds"){
        ms +="...\n" + (1+findYourPlace(message.author.id)) + ". " + TopInvs[findYourPlace(message.author.id)].name + " - " + Emerald + " " + TopInvs[findYourPlace(message.author.id)].em;
      }
      else{
        ms +="...\n" + (1+findYourPlace(message.author.id)) + ". " + TopInvs[findYourPlace(message.author.id)].name + " - Level " + TopInvs[findYourPlace(message.author.id)].lvl;
      }
      
    }
    //Message("Top 10 Leaderboard! kb!lb <lb-type> [page]", ms + "\n*Leaderboard types: levels, emerald, keplerium, obsidian, lapis, redstone, diamond, gold, iron, coal, stone, regenland, enchants, lootbox, mined, minerscore*", message, "eeee33");
  
    let embed = new Commando.RichEmbed()
        .setAuthor(bot.user.username, bot.user.avatarURL)
        .setTitle("Top 10 Leaderboard! kb!lb <lb-type> [page]")
        .addField("**Leaderboard:**", ms, false)
        .addField("**Leaderboard Types:**", "*levels, emerald, keplerium, obsidian, lapis, redstone, diamond, gold, iron, coal, stone, regenland, enchants, lootbox, mined, minerscore*", false)
        .setColor("eeee33")
        .setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL);
        //.setTimestamp();

    message.channel.send(embed);
    addPickaxeRoles(message, I);
};
var PickaxeCommand = function(message, args){
    var yourarray = findYourId(message.author.id);
    if(yourarray == -1){
        makeNewInventory(message);
        yourarray = Invs.length-1;
    }
    var I = Invs[yourarray];
  
    updateInventory(I);
    I.name = message.author.username.toString();
  
    if(args[0] == NaN || args[0] == undefined || args[0] == ""){
      var allurpicks = "";
      var picksallur = [
        "Wooden", "Stone", "Iron", "Diamond", "Gold", "Redstone", "Lapis", "Emerald", "Donator", "Golem", "Goldium", "Diamondite", "Emeraldium", "Keplerium"
      ]
      for(var i = 0;i < pickaxes.length;i ++){
        if(I.picks[0] === "1"){
          allurpicks +=pickaxes[i] + " " + picksallur[i] + " Pick\n";
        }
      }
      var theembed = new Commando.RichEmbed()
            .setTitle(`**${I.name}'s Pickaxes**`)
            .setColor("22ff88")
            .addField(`Currently Held Pickaxe: **${picksallur[I.pick]}** ${pickaxes[I.pick]}`, "Fortune " + I.en.fortune[I.pick] + "\nEfficiency " + I.en.eff[I.pick] + "\nExperience " + I.en.xp[I.pick] + "\nWorld Regeneration " + I.en.cd[I.pick])
            .addField(`Pickaxes: `, allurpicks, false); 
      message.channel.send(theembed);
      return;
    }
  
    var pickk = args[0];
    pickk = pickk.toLowerCase();
    if((pickk === "wood" || pickk === "planks" || pickk === "wooden")){pickk = 0;}
    if((pickk === "stone" || pickk === "cobble" || pickk === "cobblestone")){pickk = 1;}
    if(pickk === "iron"){pickk = 2;}
    if(pickk === "diamond"){pickk = 3;}
    if(pickk === "gold"){pickk = 4;}
    if(pickk === "redstone"){pickk = 5;}
    if(pickk === "lapis"){pickk = 6;}
    if(pickk === "emerald"){pickk = 7;}
    if((pickk === "donate" || pickk === "donator" || pickk === "donated")){pickk = 8;}
    if(pickk === "golem"){pickk = 9;}
    if(pickk === "goldium"){pickk = 10;}
    if(pickk === "diamondite"){pickk = 11;}
    if(pickk === "emeraldium"){pickk = 12;}
    if(pickk === "keplerium"){pickk = 13;}
    pickk = Math.floor(pickk);
    if(pickk < 0 || pickk > I.picks.length-1){
      Message("Uh oh!", "That pickaxe doesn't exist!", message, "ee3333");
      return;
    }
    if(I.picks[pickk] === "1"){
      I.pick = pickk;
      Message("Pickaxe Switched!", "Pickaxe switched to " + pickaxes[pickk], message);
    }
    else{
      Message("Uh oh!", "You don't own that pick!", message, "ee3333");
    }
};
var CrateCommand = function(message, args){
    var yourarray = findYourId(message.author.id);
    if(yourarray == -1){
        makeNewInventory(message);
        yourarray = Invs.length-1;
    }
    var I = Invs[yourarray];
  
    updateInventory(I);
    if(I.lostitems == 0){
      message.channel.send("If you have lost items from a recent rollback on 2019/11/06, you can go to the kepler miner server by doing kb!server and go to the #restore-data channel and follow the instructions there!");
      I.lostitems = 1;
    }
    I.name = message.author.username.toString();
    if(args[0] === undefined || args[0] === ""){
      Message("**YOUR LOOTBOXES: **"+ crates, "Lootboxes: " + I.crates + " " + lootbox + "\n**Do `kb!lootbox open` to open a lootbox**", message);  
      return; 
    }
    if(args[0] === "open" && I.crates > 0){
      I.crates --;
      I.sts[1] ++; //crate stat
      var crateNum = Math.floor(Math.random()*50); //0 - 49
      /** COMMON */
      if(crateNum == 0){
        Message("**COMMON**", "You found 20 Stone!", message, "22ee66");
        I.inv.st +=20;
      }
      if(crateNum == 1){
        Message("**COMMON**", "You found 20 Coal!", message, "22ee66");
        I.inv.co +=20;
      }
      if(crateNum == 2){
        Message("**COMMON**", "You found 20 Iron!", message, "22ee66");
        I.inv.ir +=20;
      }
      if(crateNum == 3){
        Message("**COMMON**", "You found 10 Diamonds!", message, "22ee66");
        I.inv.di +=10;
      }
      if(crateNum == 4){
        Message("**COMMON**", "You found 20 Gold!", message, "22ee66");
        I.inv.go +=20;
      }
      if(crateNum == 5){
        Message("**COMMON**", "You found 20 Redstone!", message, "22ee66");
        I.inv.re +=20;
      }
      if(crateNum == 6){
        Message("**COMMON**", "You found 20 Lapis!", message, "22ee66");
        I.inv.la +=20;
      }
      if(crateNum == 7){
        Message("**COMMON**", "You found 10 Emeralds!", message, "22ee66");
        I.inv.em +=10;
      }
      if(crateNum == 8){
        Message("**COMMON**", "You found 20 XP!", message, "22ee66");
        I.xp +=20;
        levelUp(I, message);
      }
      if(crateNum == 9){
        Message("**COMMON**", "You found 15 Stone!", message, "22ee66");
        I.inv.st +=15;
      }
      if(crateNum == 10){
        Message("**COMMON**", "You found 15 Coal!", message, "22ee66");
        I.inv.co +=15;
      }
      if(crateNum == 11){
        Message("**COMMON**", "You found 15 Iron!", message, "22ee66");
        I.inv.ir +=15;
      }
      if(crateNum == 12){
        Message("**COMMON**", "You found 8 Diamonds!", message, "22ee66");
        I.inv.di +=8;
      }
      if(crateNum == 13){
        Message("**COMMON**", "You found 15 Gold!", message, "22ee66");
        I.inv.go +=15;
      }
      if(crateNum == 14){
        Message("**COMMON**", "You found 15 Redstone!", message, "22ee66");
        I.inv.re +=15;
      }
      if(crateNum == 15){
        Message("**COMMON**", "You found 15 Lapis!", message, "22ee66");
        I.inv.la +=15;
      }
      if(crateNum == 16){
        Message("**COMMON**", "You found 8 Emeralds!", message, "22ee66");
        I.inv.em +=8;
      }
      if(crateNum == 17){
        Message("**COMMON**", "You found 15 XP!", message, "22ee66");
        I.xp +=15;
        levelUp(I, message);
      }
      if(crateNum == 18){
        Message("**COMMON**", "You found 30 Stone!", message, "22ee66");
        I.inv.st +=30;
      }
      if(crateNum == 19){
        Message("**COMMON**", "You found 30 Coal!", message, "22ee66");
        I.inv.co +=30;
      }
      if(crateNum == 20){
        Message("**COMMON**", "You found 30 Iron!", message, "22ee66");
        I.inv.ir +=30;
      }
      if(crateNum == 21){
        Message("**COMMON**", "You found 12 Diamonds!", message, "22ee66");
        I.inv.di +=12;
      }
      if(crateNum == 22){
        Message("**COMMON**", "You found 30 Gold!", message, "22ee66");
        I.inv.go +=30;
      }
      if(crateNum == 23){
        Message("**COMMON**", "You found 30 Redstone!", message, "22ee66");
        I.inv.re +=30;
      }
      if(crateNum == 24){
        Message("**COMMON**", "You found 30 Lapis!", message, "22ee66");
        I.inv.la +=30;
      }
      if(crateNum == 25){
        Message("**COMMON**", "You found 12 Emeralds!", message, "22ee66");
        I.inv.em +=12;
      }
      if(crateNum == 26){
        Message("**COMMON**", "You found 30 XP!", message, "22ee66");
        I.xp +=30;
        levelUp(I, message);
      }
      if(crateNum == 27){
        Message("**COMMON**", "You found 35 Stone!", message, "22ee66");
        I.inv.st +=35;
      }
      if(crateNum == 28){
        Message("**COMMON**", "You found 35 Iron!", message, "22ee66");
        I.inv.ir +=35;
      }
      if(crateNum == 29){
        Message("**COMMON**", "You found 15 Diamonds!", message, "22ee66");
        I.inv.di +=15;
      }
      if(crateNum == 30){
        Message("**COMMON**", "You found 50 XP!", message, "22ee66");
        I.xp +=50;
        levelUp(I, message);
      }
      if(crateNum == 31){
        Message("**RARE**", "You found 50 Stone!", message, "2222ee");
        I.inv.st +=50;
      }
      if(crateNum == 32){
        Message("**RARE**", "You found 50 Redstone!", message, "2222ee");
        I.inv.re +=50;
      }
      if(crateNum == 33){
        Message("**RARE**", "You found 50 Lapis!", message, "2222ee");
        I.inv.re +=50;
      }
      if(crateNum == 34){
        Message("**RARE**", "You found 25 Diamonds!", message, "2222ee");
        I.inv.di +=25;
      }
      if(crateNum == 35){
        Message("**RARE**", "You found 25 Emeralds!", message, "2222ee");
        I.inv.em +=25;
      }
      if(crateNum == 36){
        Message("**RARE**", "You found 100 XP!", message, "2222ee");
        I.xp +=100;
        levelUp(I, message);
      }
      if(crateNum == 36){
        Message("**RARE**", "You found 150 XP!", message, "2222ee");
        I.xp +=150;
        levelUp(I, message);
      }
      if(crateNum == 37){
        Message("**RARE**", "You gained a level and levelled up to Level " + Math.floor(I.lvl+1) + "!", message, "2222ee");
        I.xp = 0;
        I.lvl ++;
      }
      if(crateNum == 38){
        Message("**RARE**", "You found 1 Obsidian", message, "2222ee");
        I.inv.ob +=1;
      }
      if(crateNum == 39){
        Message("**RARE**", "You found 1 Keplerium", message, "2222ee");
        I.inv.ke +=1;
      }
      if(crateNum == 40){
        Message("**EPIC**", "You found 100 Iron", message, "8822ee");
        I.inv.ir +=100;
      }
      if(crateNum == 41){
        Message("**EPIC**", "You found 2 Obsidian", message, "8822ee");
        I.inv.ob +=2;
      }
      if(crateNum == 42){
        Message("**EPIC**", "You found 2 Keplerium", message, "8822ee");
        I.inv.ke +=2;
      }
      if(crateNum == 43){
        Message("**EPIC**", "You gained a level and levelled up to Level " + Math.floor(I.lvl+1) + "!", message, "8822ee");
        I.lvl ++;
        levelUp(I, message);
      }
      if(crateNum == 44){
        Message("**EPIC**", "You found 300 XP!", message, "8822ee");
        I.xp +=300;
        levelUp(I, message);
      }
      if(crateNum == 45){
        Message("**EPIC**", "You found 250 XP!", message, "8822ee");
        I.xp +=250;
        levelUp(I, message);
      }
      if(crateNum == 46){
        Message("**LEGENDARY**", "You found 1000 XP!", message, "eeee22");
        I.xp +=1000;
        levelUp(I, message);
      }
      if(crateNum == 47){
        Message("**LEGENDARY**", "You gained 2 levels and levelled up to Level " + Math.floor(I.lvl+2) + "!", message, "eeee22");
        I.lvl +=2;
        levelUp(I, message);
      }
      if(crateNum == 48){
        Message("**LEGENDARY**", "You found 3 Crates!", message, "eeee22");
        I.crates +=3;
      }
      if(crateNum == 49){
        Message("**LEGENDARY**", "You found 4 Obsidian", message, "eeee22");
        I.inv.ob +=4;
      }
      
    }
    else{
      Message("Outta crates!", "You've run out of crates! Get more by voting or mining!", message, "ff2222");
    }
};
var AddItemsCommand = function(message, args){
    
  //console.log(args[0].toString());
  if(args[0][0] === "<" && args[0][1] === "@"){
    var tex = args[0];
    var TX = "";
    for(var i = 2;i < tex.length-1;i ++){
      TX +=tex[i];
    }//oh hello there.
    args[0] = TX;
  }
    var yourarray = findYourId(message.author.id);
    if(yourarray == -1){
        makeNewInventory(message);
        yourarray = Invs.length-1;
    }
    var I = Invs[yourarray];
  
    updateInventory(I);
    I.name = message.author.username.toString();
  if(I.id === "374929883698036736" || I.id === "499882708860665856"){
    if(args[0] === "" || args[0] === undefined){
      Message("Uh oh!", "Do kb!additems <id> <pick:ore:xp:levels:enchant:crates:dim> <item:number:enchanttype:cratetype> [enchantlevel or crate amount]", message, "ee3333");
      return;
    }
    else{
      var selectedid = findYourId(args[0].toString());
      if(selectedid === -1){
        Message("Uh oh!", "This person isn't a miner!", message, "ee3333");
        return;
      }
      var SI = Invs[selectedid];
    updateInventory(SI);
      if(args[1] === "pick"){
        SI.pick = Math.floor(args[2]);
        SI.picks[Math.floor(args[2])] = "1";
        Message("Give Command", "Gave " + SI.name + " the " + pickaxes[SI.pick] + " Pickaxe!", message);
      }
      else{
        if(args[1] === "stone"){
          SI.inv.st +=Math.floor(args[2]);
          Message("Give Command", "Gave " + SI.name + " " + args[2] + " Stone!", message);
        }
        if(args[1] === "coal"){
          SI.inv.co +=Math.floor(args[2]);
          Message("Give Command", "Gave " + SI.name + " " + args[2] + " Coal!", message);
        }
        if(args[1] === "iron"){
          SI.inv.ir +=Math.floor(args[2]);
          Message("Give Command", "Gave " + SI.name + " " + args[2] + " Iron!", message);
        }
        if(args[1] === "gold"){
          SI.inv.go +=Math.floor(args[2]);
          Message("Give Command", "Gave " + SI.name + " " + args[2] + " Gold!", message);
        }
        if(args[1] === "diamond"){
          SI.inv.di +=Math.floor(args[2]);
          Message("Give Command", "Gave " + SI.name + " " + args[2] + " Diamonds!", message);
        }
        if(args[1] === "redstone"){
          SI.inv.re +=Math.floor(args[2]);
          Message("Give Command", "Gave " + SI.name + " " + args[2] + " Redstone!", message);
        }
        if(args[1] === "lapis"){
          SI.inv.la +=Math.floor(args[2]);
          Message("Give Command", "Gave " + SI.name + " " + args[2] + " Lapis!", message);
        }
        if(args[1] === "keplerium"){
          SI.inv.ke +=Math.floor(args[2]);
          Message("Give Command", "Gave " + SI.name + " " + args[2] + " Keplerium!", message);
        }
        if(args[1] === "emerald"){
          SI.inv.em +=Math.floor(args[2]);
          Message("Give Command", "Gave " + SI.name + " " + args[2] + " Emeralds!", message);
        }
        if(args[1] === "xp"){
          SI.xp +=Math.floor(args[2]);
          Message("Give Command", "Gave " + SI.name + " " + args[2] + " XP!", message);
        }
        if(args[1] === "levels"){
          SI.lvl +=Math.floor(args[2]);
          Message("Give Command", "Gave " + SI.name + " " + args[2] + " Levels!", message);
        }
        if(args[1] === "donator"){
          SI.donator = !SI.donator;
          Message("Donator Perks", SI.name + " is" + (SI.donator ? "" : "n't") + " a Donator now!", message);
        }
        if(args[1] === "crate" || args[1] === "lootbox"){
          SI.crates +=Math.floor(args[2]);
          Message("Give Command", "Gave " + SI.name + " " + args[2] + " Lootboxes!", message);
        }
        if(args[1] === "obsidian"){
          SI.inv.ob +=Math.floor(args[2]);
          Message("Give Command", "Gave " + SI.name + " " + args[2] + " Obsidian!", message);
        }
      }
    }
  }
     else{
    Message("Uh oh!", "You can't use this command unless you are Kep or WhiteRider!", message, "ee3333");
    return;
  }
    
};
var ResetMinerScoreCommand = function(message, args){
  var Tops = [];
  for(var i = 0;i < Invs.length;i ++){
    Tops.push({
      name: Invs[i].name,
      minerscore: Invs[i].minerscore || 0,
      id: Invs[i].id,
    });
  }
  Tops.sort(function(a, b){return b.minerscore - a.minerscore});
  var topminers = "";
  for(var i = 0;i < 10;i ++){
    topminers +="**" + Tops[i].minerscore + "** - " + Tops[i].name + " with id " + Tops[i].id + "\n";
  }
  for(var i = 0;i < 10;i ++){
    for(var j = 0;j < Invs.length;j ++){
      if(Invs[j].id === Tops[i].id && i === 0){
        Invs[j].xp +=500;
        Invs[j].crates[3] ++;
      }
      if(Invs[j].id === Tops[i].id && i === 1){
        Invs[j].xp +=400;
        Invs[j].crates[3] ++;
      }
      if(Invs[j].id === Tops[i].id && i === 2){
        Invs[j].xp +=300;
        Invs[j].crates[3] ++;
      }
      if(Invs[j].id === Tops[i].id && i === 3){
        Invs[j].xp +=250;
        Invs[j].crates[3] ++;
      }
      if(Invs[j].id === Tops[i].id && i === 4){
        Invs[j].xp +=200;
        Invs[j].crates[3] ++;
      }
      if(Invs[j].id === Tops[i].id && i === 5){
        Invs[j].xp +=175;
        Invs[j].crates[2] ++;
      }
      if(Invs[j].id === Tops[i].id && i === 6){
        Invs[j].xp +=150;
        Invs[j].crates[2] ++;
      }
      if(Invs[j].id === Tops[i].id && i === 7){
        Invs[j].xp +=125;
        Invs[j].crates[2] ++;
      }
      if(Invs[j].id === Tops[i].id && i === 8){
        Invs[j].xp +=100;
        Invs[j].crates[2] ++;
      }
      if(Invs[j].id === Tops[i].id && i === 9){
        Invs[j].xp +=100;
        Invs[j].crates[1] +=2;
      }
    }
  }
  for(var j = 0;j < Invs.length;j ++){
    Invs[j].minerscore = 0;
  }
  Message("Minerscore leaderboards", "Sending you the list right now and resetting them!", message, "ee3333");
  bot.users.get("374929883698036736").send("The Top Miners of this month are:\n" + topminers);
};
var GiveCommand = function(message, args){//I think it's .includes()
  let targetUser = message.guild.member(message.mentions.users.first()) || args[0];
  if(!targetUser) return Message("Uh oh!", "Who do you want to give items to?", message, "ee3333");
  if(targetUser.id === message.author.id && message.author.id !== "468811298466168852" ) return Message("Uh oh!", "You can't give yourself items silly!", message, "ee3333");
  
    var yourarray = findYourId(message.author.id);
    if(yourarray == -1){
        makeNewInventory(message);
        yourarray = Invs.length-1;
    }
    var I = Invs[yourarray];//Bowtie it works
  
    updateInventory(I);
    I.name = message.author.username.toString();
    
    if(args[0] === "" || args[0] === undefined || args[1] === "" || args[1] === undefined || args[2] === "" || args[2] === undefined){
      Message("Uh oh!", "Do kb!give <id> <ore> <item:number>", message, "ee3333");
      return;
    }
    else{
      var selectedid = findYourId(targetUser.id);
      if(selectedid === -1){
        Message("Uh oh!", "This person isn't a miner!", message, "ee3333");
        return;
      }
      var SI = Invs[selectedid];
    updateInventory(SI);
    updateInventory(I);
      if(args[1] === "pick" || args[1] === "xp" || args[1] === "levels" || args[1] === "donator" || args[1] === "crate"){
        Message("Uh oh!", `${message.author.username} doesn't have permission to do that...`, message, "ee3333");
        return;
      } else {
        let amt = parseInt(args[2]);//it works. look in the discord thingy
        if(parseInt(amt) <= 0 || isNaN(Math.floor(parseInt(args[2])))) return Message("Uh oh!", `You have to choose a positive number to give!`, message, "ee3333");
        
        if(args[1] === "stone"){
          if(amt > I.inv.st) return Message("Uh oh!", "You don't have enough of that material!", message, "ee3333");
          I.inv.st -= Math.floor(amt);
          SI.inv.st += Math.floor(amt);
        }
        if(args[1] === "coal"){
          if(amt > I.inv.co) return Message("Uh oh!", "You don't have enough of that material!", message, "ee3333");
          I.inv.co -= Math.floor(amt);
          SI.inv.co +=Math.floor(args[2]);
        }
        if(args[1] === "iron"){
          if(amt > I.inv.ir) return Message("Uh oh!", "You don't have enough of that material!", message, "ee3333");
          I.inv.ir -= Math.floor(amt);
          SI.inv.ir +=Math.floor(args[2]);
        }
        if(args[1] === "gold"){
          if(amt > I.inv.go) return Message("Uh oh!", "You don't have enough of that material!", message, "ee3333");
          I.inv.go -= Math.floor(amt);
          SI.inv.go +=Math.floor(args[2]);
        }
        if(args[1] === "diamond"){
          if(amt > I.inv.di) return Message("Uh oh!", "You don't have enough of that material!", message, "ee3333");
          I.inv.di -= Math.floor(amt);
          SI.inv.di +=Math.floor(args[2]);
        }
        if(args[1] === "redstone"){
          if(amt > I.inv.re) return Message("Uh oh!", "You don't have enough of that material!", message, "ee3333");
          I.inv.re -= Math.floor(amt);
          SI.inv.re +=Math.floor(args[2]);
         }
        if(args[1] === "lapis"){
          if(amt > I.inv.la) return Message("Uh oh!", "You don't have enough of that material!", message, "ee3333");
          I.inv.la -= Math.floor(amt);
          SI.inv.la +=Math.floor(args[2]);
        }
        if(args[1] === "emerald"){
          if(amt > I.inv.em) return Message("Uh oh!", "You don't have enough of that material!", message, "ee3333");
          I.inv.em -= Math.floor(amt);
          SI.inv.em +=Math.floor(args[2]);
        }
        if(args[1] === "obsidian"){
          if(amt > I.inv.ob) return Message("Uh oh!", "You don't have enough of that material!", message, "ee3333");
          I.inv.ob -= Math.floor(amt);
          SI.inv.ob +=Math.floor(args[2]);
        }
        if(args[1] === "keplerium"){
          if(amt > I.inv.ke) return Message("Uh oh!", "You don't have enough of that material!", message, "ee3333");
          I.inv.ke -= Math.floor(amt);
          SI.inv.ke +=Math.floor(args[2]);
        }
        Message("Give Command", `${message.author.username} gave ${SI.name} ${args[2]} ${args[1]}`, message);
      }
    }
  
};
var StatsCommand = function(message){
    var activethisday = 0;
    var activethisweek = 0;
    for(var i = 0; i < Invs.length;i ++){
      var d = Date.now();
      if(Invs[i].last[0]+86400000 > d){
        activethisday ++;
      }
      if(Invs[i].last[0]+604800000 > d){
        activethisweek ++;
      }
    }
    var totalblocksmined = 0;
    for(var i = 0;i < Invs.length;i ++){
      totalblocksmined +=Invs[i].sts[0];
    }
    Message("**Stats!:**","Players: **" + Invs.length + "**\nServers: **" + bot.guilds.size + "**\nActive in the past 24 hours: **" + activethisday + "**\nActive in the past 7 Days: **" + activethisweek + "**\nTotal Blocks Mined: **" + totalblocksmined + "**", message);
};
var ShopCommand = function(message, args){
  var yourarray = findYourId(message.author.id);
  if(yourarray == -1){
      makeNewInventory(message);
      yourarray = Invs.length-1;
      console.log("User " + Invs[Invs.length-1].id + " Created!");
  }
  //console.log(message.author.username.toString());
  var I = Invs[yourarray];
  updateInventory(I);
  var shoptype = 1;
  var Items = [];
  var Display = "";
      Items = [
        {name:"Fortune",cost:40,addcost:60,maxlevel:3},
        {name:"Efficiency",cost:80,addcost:40,maxlevel:5},
        {name:"XP Boost",cost:60,addcost:50,maxlevel:3},
        {name:"Regenland",cost:100,addcost:45,maxlevel:5},
      ];
  if(args[0] === "" || args[0] === undefined){
      for(var i = 0;i < Items.length;i ++){
        Display +="\nID: " + i + " - **" + Items[i].name + " ";
        var DD = 0;
        if(i === 0)DD =I.en.fortune[I.pick];
        if(i === 1)DD =I.en.eff[I.pick];
        if(i === 2)DD =I.en.xp[I.pick];
        if(i === 3)DD =I.en.cd[I.pick];
        DD = Math.floor(DD);
        DD ++;
        Display +=DD;
        Display +="** - ";
        if(DD >= Items[i].maxlevel){
          Display +="MAXED OUT";
        }
        else{
          Display +=(Items[i].cost + (Items[i].addcost * DD)) + Lapis;
        }
      }
    Message("**Enchantments**", Display + "\nIf you'd like to buy an enchant, use `kb!enchant <enchantment-id>`!\nSelected Pickaxe: " + pickaxes[I.pick], message);
  }
  else if(Math.floor(args[0]) >= 0 && Math.floor(args[0]) < Items.length){
    var chosen = Items[Math.floor(args[0])];
    var type = Math.floor(args[0]);
    var thingy = 0;
      if(type === 0)thingy = I.en.fortune[I.pick];
      if(type === 1)thingy = I.en.eff[I.pick];
      if(type === 2)thingy = I.en.xp[I.pick];
      if(type === 3)thingy = I.en.cd[I.pick];
      thingy = Math.floor(thingy);
      var cost = (chosen.cost + (chosen.addcost * thingy));
      if(thingy >= chosen.maxlevel){
        Message("Maxed Out", "You've already maxed this enchantment out! Awesome!", message);
      }
      else if(I.inv.la >= cost){
        I.inv.la -=cost;
        if(type === 0){
          var theLevel = Math.floor(I.en.fortune[I.pick]);
          theLevel ++;
          I.en.fortune = updateEnchants(I, I.pick, theLevel + "", I.en.fortune);
        }
        if(type === 1){
          var theLevel = Math.floor(I.en.eff[I.pick]);
          theLevel ++;
          I.en.eff = updateEnchants(I, I.pick, theLevel + "", I.en.eff);
        }
        if(type === 2){
          var theLevel = Math.floor(I.en.xp[I.pick]);
          theLevel ++;
          I.en.xp = updateEnchants(I, I.pick, theLevel + "", I.en.xp);
        }
        if(type === 3){
          var theLevel = Math.floor(I.en.cd[I.pick]);
          theLevel ++;
          I.en.cd = updateEnchants(I, I.pick, theLevel + "", I.en.cd);
        }
        thingy ++;
        I.sts[2] ++;
        Message("Successfully Enchanted", "You just enchanted " + pickaxes[I.pick] + " with " + chosen.name + " " + thingy, message);
      }
      else{
        Message("Oops!", "You need " + (cost - I.inv.la) + " more " + Lapis, message);
      }
  }
};
/*var EnchantCommand = function(message){
  var yourarray = findYourId(message.author.id);
  if(yourarray == -1){
      makeNewInventory(message);
      yourarray = Invs.length-1;
      console.log("User " + Invs[Invs.length-1].id + " Created!");
  }
  //console.log(message.author.username.toString());
  var I = Invs[yourarray];
  updateInventory(I);
    if(I.lostitems == 0){
      message.channel.send("If you have lost items from a recent rollback on 2019/11/06, you can go to the kepler miner server by doing kb!server and go to the #restore-data channel and follow the instructions there!");
      I.lostitems = 1;
    }
  Message("Your Enchantments", "**Cooldown " + I.en.cooldown + "**\nYou can mine every **" + (5-I.en.cooldown)
          + " seconds\nFortune " + I.en.fortune + "**\nYou get **" + (I.en.fortune*100) + "%** more ores"
          + "\n**Luck " + I.en.luck + "**\nYou are **" + (I.en.luck*5) + "%** more likely to get ores than stone"
          + "\n**XP Boost" + I.en.xp + "**\nYou will get **" + (-1+timesXpBoost(I.en.xp, I)) + "%** more xp", message);
};*/
/*var DimensionCommand = function(message, args){
  var yourarray = findYourId(message.author.id);
  if(yourarray == -1){
      makeNewInventory(message);
      yourarray = Invs.length-1;
      console.log("User " + Invs[Invs.length-1].id + " Created!");
  }
  //console.log(message.author.username.toString());
  var I = Invs[yourarray];
  updateInventory(I);
    if(I.lostitems == 0){
      message.channel.send("If you have lost items from a recent rollback on 2019/11/06, you can go to the kepler miner server by doing kb!server and go to the #restore-data channel and follow the instructions there!");
      I.lostitems = 1;
    }
  if(args[0] === undefined || args[0] === ""){
      Message("Hmmm", "Usage: `kb!dim <overworld/nether>`", message, "eeee33");
  }
  if(Date.now() < I.ds+(regentime*2)){
      Message("A little too quick!", "Please wait " + (((I.ds+(regentime*2))-Date.now())/1000/60).toFixed(0) + " Minutes!", message, "ee3333");
      return;
  }
  if(args[0] === "0" || args[0] === 0 || args[0] === "overworld"){
    if(I.pick >= 10){
      Message("Uh oh!", "You need to be using an allowed pickaxe in this dimension!", message, "ee3333");
      return;
    }
    I.dim = 0;
    I.ds = Date.now();
    I.lastregen = Date.now();
    createLand(I, 0);
    Message("Success", "You have now been transported to the Overworld!", message, "ee3333");
  }
  if(args[0] === "1" || args[0] === 1 || args[0] === "nether"){
    if(I.dims[1] === false){
      Message("Uh oh!", "You have to craft a nether portal first! Use `kb!craft nether` to make one!", message, "ee3333");
      return;
    }
    if(I.pick !== 3 && I.pick !== 4 && I.pick !== 5 && I.pick !== 9){
      Message("Uh oh!", "You need to be using an allowed pickaxe in this dimension!\nOnly Diamond, Keplerium, Voter and Donator Pickaxes are aloud.", message, "ee3333");
      return;
    }
    I.dim = 1;
    I.ds = Date.now();
    I.lastregen = Date.now();
    createLand(I, 1);
    Message("Success", "You have now been transported to the Nether!", message, "ee3333");
  }
};*/

//Trading
var tradeables = ["stone", "coal", "iron", "diamond", "gold", "redstone", "lapis", "keplerium", "emerald", "obsidian"];
var TradeCommand = function(message, args){ //kb!trade @User/userid type(diamond, keplerium etc.) amt type2 amt2  (which sets a trade up)  OR   kb!trade @User (which confirms the trade)
  var yourarray = findYourId(message.author.id);
  if(yourarray == -1){
      makeNewInventory(message);
      yourarray = Invs.length-1;
      console.log("User " + Invs[Invs.length-1].id + " Created!");
  }
  //console.log(message.author.username.toString());
  var I = Invs[yourarray];
  updateInventory(I);
    if(I.lostitems == 0){
      message.channel.send("If you have lost items from a recent rollback on 2019/11/06, you can go to the kepler miner server by doing kb!server and go to the #restore-data channel and follow the instructions there!");
      I.lostitems = 1;
    }
  
  //Setup user
  if(args[0] === "" || args[0] === undefined || args[0] === "cancel" || args[0] === "confirm"){
    Message("Hmm...", "Usage: `kb!trade <user> <item from you to them> <amt> <item from them to you> <amt>` to start a trade\nor\n`kb!trade <user> confirm` to confirm a trade", message, "eeee33");
    return;
  }
  var ID = "";
  let targetUser = message.guild.member(message.mentions.users.first()) || args[0];
  //console.log(targetUser.id + " vs. " + targetUser);
  ID = targetUser.id || targetUser;
  //console.log("ID Became: " + ID);
  var theirarray = findYourId(ID);
  if(theirarray === -1 || theirarray + "a" === "NaNa" || theirarray === undefined){
    return;
  }
  var J = Invs[theirarray];
  updateInventory(J);
  //console.log(Math.floor(args[2]) + "a");
  if(theirarray === -1){
    Message("Uh oh!", "The person you are trading with isn't a miner! Ask them to join!", message, "ee3333");
    return;
  }
  
  if(args[1] === "" || args[1] === undefined || args[1] === "cancel" || args[1] === "confirm"){
    //Trade confirmation code here
    if(args[1] === "cancel"){
      //cancel command
      if(checkIfTraded(yourarray, theirarray) >= 0){
        ActiveTrades.splice(checkIfTraded(yourarray, theirarray), 1);
        Message("Success", "Trade Successfully Cancelled! :D", message, "33ee33");
        return;
      }
      else{
        Message("Hmm...", "Looks like you don't have any trades with this person...", message, "eeee33");
        return;
      }
    }
    if(args[1] === "confirm"){
      if(checkIfTraded(yourarray, theirarray) >= 0){
        var TR = ActiveTrades[checkIfTraded(yourarray, theirarray)];
        /*
            tradecreation: Date.now(),
            tradedeletion: Date.now()+1800000,
            trader1: yourarray,
            trader2: theirarray,
            trade1: args[1],
            trade2: args[3],
            amt1: Math.floor(args[2]),
            amt2: Math.floor(args[4]),
      */
        var trader1 = Invs[TR.trader1];
        var trader2 = Invs[TR.trader2];
        if(TR.trader1 === yourarray){
          Message("Uh oh!", "The other person has to confirm it, not you!", message, "ee3333");
          return;
        }
        //you give them their stuff
        if(TR.trade1 === "stone"){
          trader2.inv.st +=TR.amt1;
          trader1.inv.st -=TR.amt1;
        }
        if(TR.trade1 === "coal"){
          trader2.inv.co +=TR.amt1;
          trader1.inv.co -=TR.amt1;
        }
        if(TR.trade1 === "iron"){
          trader2.inv.ir +=TR.amt1;
          trader1.inv.ir -=TR.amt1;
        }
        if(TR.trade1 === "diamond"){
          trader2.inv.di +=TR.amt1;
          trader1.inv.di -=TR.amt1;
        }
        if(TR.trade1 === "gold"){
          trader2.inv.go +=TR.amt1;
          trader1.inv.go -=TR.amt1;
        }
        if(TR.trade1 === "redstone"){
          trader2.inv.re +=TR.amt1;
          trader1.inv.re -=TR.amt1;
        }
        if(TR.trade1 === "lapis"){
          trader2.inv.la +=TR.amt1;
          trader1.inv.la -=TR.amt1;
        }
        if(TR.trade1 === "keplerium"){
          trader2.inv.ke +=TR.amt1;
          trader1.inv.ke -=TR.amt1;
        }
        if(TR.trade1 === "emerald"){
          trader2.inv.em +=TR.amt1;
          trader1.inv.em -=TR.amt1;
        }
        if(TR.trade1 === "obsidian"){
          trader2.inv.ob +=TR.amt1;
          trader1.inv.ob -=TR.amt1;
        }
        
        //and they give you some of their stuff!
        
        if(TR.trade2 === "stone"){
          trader1.inv.st +=TR.amt2;
          trader2.inv.st -=TR.amt2;
        }
        if(TR.trade2 === "coal"){
          trader1.inv.co +=TR.amt2;
          trader2.inv.co -=TR.amt2;
        }
        if(TR.trade2 === "iron"){
          trader1.inv.ir +=TR.amt2;
          trader2.inv.ir -=TR.amt2;
        }
        if(TR.trade2 === "diamond"){
          trader1.inv.di +=TR.amt2;
          trader2.inv.di -=TR.amt2;
        }
        if(TR.trade2 === "gold"){
          trader1.inv.go +=TR.amt2;
          trader2.inv.go -=TR.amt2;
        }
        if(TR.trade2 === "redstone"){
          trader1.inv.re +=TR.amt2;
          trader2.inv.re -=TR.amt2;
        }
        if(TR.trade2 === "lapis"){
          trader1.inv.la +=TR.amt2;
          trader2.inv.la -=TR.amt2;
        }
        if(TR.trade2 === "keplerium"){
          trader1.inv.ke +=TR.amt2;
          trader2.inv.ke -=TR.amt2;
        }
        if(TR.trade2 === "emerald"){
          trader1.inv.em +=TR.amt2;
          trader2.inv.em -=TR.amt2;
        }
        if(TR.trade2 === "obsidian"){
          trader1.inv.ob +=TR.amt2;
          trader2.inv.ob -=TR.amt2;
        }
        ActiveTrades.splice(checkIfTraded(yourarray, theirarray), 1);
        Message("Traded!", "You have successfully traded with " + trader1.name, message, "33ee33");
      }
      else{
        Message("Uh oh!", "You have to start a trade with them silly!", message, "ee3333");
      }
    }
  }
  else{
    var T = -1;
    for(var i = 0;i < tradeables.length;i ++){
      if(args[1] === tradeables[i]){
        T = i;
      }
    }
    if(T === -1){
      Message("Uh oh!", "That ain't an item silly!", message, "ee3333");
      return;
    }
    if(Math.floor(args[2]) <= 0){
      Message("Uh oh!", "That number has to be ABOVE 0", message, "ee3333");
      return;
    }
    if(isNaN(Math.floor(parseInt(args[2])))) {
      Message("Uh oh!", "That ain't a number silly!", message, "ee3333");
      return;
    }
    var T = -1;
    for(var i = 0;i < tradeables.length;i ++){
      if(args[3] === tradeables[i]){
        T = i;
      }
    }
    if(T === -1){
      Message("Uh oh!", "That ain't an item silly!", message, "ee3333");
      return;
    }
    if(Math.floor(args[4]) <= 0){
      Message("Uh oh!", "That number has to be ABOVE 0", message, "ee3333");
      return;
    }
    if(Math.floor(args[4]) + "a" === "NaNa"){
      Message("Uh oh!", "That ain't a number silly!", message, "ee3333");
      return;
    }
    if(args[1] === "stone" && I.inv.st < Math.floor(args[2])){ Message("Uh oh!", "You don't have enough!", message, "ee3333");}
    if(checkIfTraded(yourarray, theirarray) >= 0){
      Message("Hmm...", "Looks like you have an ongoing trade with this person already.\ndo kb!trade @User cancel to cancel that trade and re enter in your new one.", message, "eeee33");
      return;
    }
    if(!checkIfEnough(I, args[1], Math.floor(args[2]))){
      Message("Uh oh!", "You don't have enough!", message, "ee3333");
      return;
    }
    if(!checkIfEnough(J, args[3], Math.floor(args[4]))){
      Message("Uh oh!", "They don't have enough!", message, "ee3333");
      return;
    }
    ActiveTrades.push({
      tradecreation: Date.now(),
      tradedeletion: Date.now()+1800000,
      trader1: yourarray,
      trader2: theirarray,
      trade1: args[1],
      trade2: args[3],
      amt1: Math.floor(args[2]),
      amt2: Math.floor(args[4]),
    });
    var AT = ActiveTrades[ActiveTrades.length-1];
    Message("Trade Requested", Invs[AT.trader1].name + " has successfully asked " + Invs[AT.trader2].name + " to give them " + AT.amt2 + " " + AT.trade2 + "\nin exchange for "
            + AT.amt1 + " " + AT.trade1 + ".\nThe trade will expire 30 minutes from now if they don't confirm", message, "33ee33");
  }
};

/*var conversions = [
  300, 250, 60, 60, 30, 30, 30 //stone, coal, iron, gold, diamond, redstone, lapis, keplerium
];//these are how much of each material for an emerald, this may change overtime with a noise().
//
var materialsToBuy = [Stone, Coal, Iron, Gold, Diamond, Redstone, Lapis];
var VillagerCommand = function(message, args){
  var yourarray = findYourId(message.author.id);
  if(yourarray == -1){
      makeNewInventory(message);
      yourarray = Invs.length-1;
      console.log("User " + Invs[Invs.length-1].id + " Created!");
  }
  var I = Invs[yourarray];
  updateInventory(I);
  
    if(I.lostitems == 0){
      message.channel.send("If you have lost items from a recent rollback on 2019/11/06, you can go to the kepler miner server by doing kb!server and go to the #restore-data channel and follow the instructions there!");
      I.lostitems = 1;
    }
  if(I.level < 5){
    Message("Uh oh!", "You must be level 5 to use the villager!", message, "ee3333");
    return;
  }
  //kb!villager buy [material] [amt]
  //kb!villager list/prices (or nothing)
  //kb!villager invest [material] [amt]
  var M = "";
  if(!args[0] || args[0] === undefined || args[0] === "" || args[0] === "prices"){
    for(var i = 0;i < materialsToBuy.length;i ++){
      if(conversions[i] < 1){
        M +=`${materialsToBuy[i]}1 = ${Math.floor(emvalue/conversions[i])}${emerald}\n`;
      }
      else{
        M +=`${materialsToBuy[i]}${Math.floor(conversions[i]*emvalue)} = 1 ${emerald}\n`;
      }
    }
  }      
      //end command
      //we'll use this as I want to put an image of a villager
  let embed = new Commando.RichEmbed()
        .setAuthor(bot.user.username, bot.user.avatarURL)
        .setTitle('Villager')
        .setDescription(M)
        .setThumbnail('https://gamepedia.cursecdn.com/minecraft_gamepedia/thumb/0/05/Snowy_Villager_Base.png/135px-Snowy_Villager_Base.png?version=ecce78de1f4790d1cf425c5690c63962')
        .setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL)
        .setColor("22ff88");

  message.channel.send(embed);
};
var buyables = ["stone", "coal", "iron", "gold", "diamond", "redstone", "lapis"];*/
//buy materials from ems
/*var GetBuying = function(arg){
  for(var i = 0;i < buyables.length;i ++){
    if(buyables[i] === arg){
      return i;
    }
  }
  return -1;
};
var BuyCommand = function(message, args){//kb!buy <material-to-buy> <number of ems to sell>
  var yourarray = findYourId(message.author.id);
  if(yourarray == -1){
      makeNewInventory(message);
      yourarray = Invs.length-1;
      console.log("User " + Invs[Invs.length-1].id + " Created!");
  }
  var I = Invs[yourarray];
  updateInventory(I);
  
    if(I.lostitems == 0){
      message.channel.send("If you have lost items from a recent rollback on 2019/11/06, you can go to the kepler miner server by doing kb!server and go to the #restore-data channel and follow the instructions there!");
      I.lostitems = 1;
    }
  if(I.level < 5){
    Message("Uh oh!", "You must be level 5 to use the buy command!", message, "ee3333");
    return;
  }
  if(args[0] === undefined || args[0] === ""){
    Message("Hmm...", "Usage: `kb!buy <emstosell> <itemtobuy>`", message, "eeee33");
    return;
  }
  if(args[1] === undefined || args[1] === ""){
    Message("Uh oh!", "Please specify the item you want to get", message, "ee3333");
    return;
  }
  var emtosell = Math.floor(args[0]);
    //Checks if the material is available to buy
    if(GetBuying(args[1]) !== -1) {
      //message.channel.send(`You can buy ${args[1]} material`);//thats it, just switch them around
      var AMT = Math.floor(conversions[GetBuying(args[1])]*emvalue)*emtosell;
      if(I.inv.emerald >= emtosell && AMT > 0){
        if(I.lb+3600000> Date.now()){
          Message("Oof", `You must wait ${Math.floor((I.lb+60000-Date.now())/60000)} minutes!`, message, "ee3333");
          return;
        }
        I.inv.emerald -=emtosell;
        if(GetBuying(args[1]) === 0){
          I.inv.stone +=AMT;
          Message("Success!", `You've earned ${AMT} stone!`, message, "33ee33");
        }
        if(GetBuying(args[1]) === 1){
          I.inv.coal +=AMT;
          Message("Success!", `You've earned ${AMT} coal!`, message, "33ee33");
        }
        if(GetBuying(args[1]) === 2){
          I.inv.iron +=AMT;
          Message("Success!", `You've earned ${AMT} iron!`, message, "33ee33");
        }
        if(GetBuying(args[1]) === 3){
          I.inv.gold +=AMT;
          Message("Success!", `You've earned ${AMT} gold!`, message, "33ee33");
        }
        if(GetBuying(args[1]) === 4){
          I.inv.diamond +=AMT;
          Message("Success!", `You've earned ${AMT} diamonds!`, message, "33ee33");
        }
        if(GetBuying(args[1]) === 5){
          I.inv.redstone +=AMT;
          Message("Success!", `You've earned ${AMT} redstone!`, message, "33ee33");
        }
        if(GetBuying(args[1]) === 6){
          I.inv.lapis +=AMT;
          Message("Success!", `You've earned ${AMT} lapis!`, message, "33ee33");
        }
        I.lb = Date.now();
        investamt --;
        if(investamt < -10) investamt = -10;
        if(investamt > 10) investamt = 10;
      } 
      else if(AMT < 0){
        Message("Oof", "You wouldn't get anything out of this trade! Perhaps wait the for the value to change.", message, "eeee33");
      }
      else{
        Message("Uh oh!", "You don't have enough emeralds!", message, "ee3333");
      }
    } else {
        Message("Uh oh!", `You cannot buy ${args[1]} material!`, message, "ee3333");
    }
};*/
//get ems from materials
/*var InvestCommand = function(message, args){
  var yourarray = findYourId(message.author.id);
  if(yourarray == -1){
      makeNewInventory(message);
      yourarray = Invs.length-1;
      console.log("User " + Invs[Invs.length-1].id + " Created!");
  }
  var I = Invs[yourarray];
  updateInventory(I); //you'll need this to access the inventory of the user
  
  if(I.level < 5){
    Message("Uh oh!", "You must be level 5 to use the invest command!", message, "ee3333");
    return;
  }
    for(var i = 0; i < materialsToBuy.length; i++) {
        //console.log(Math.floor(Math.floor(conversions[i]*emvalue)));
    }

  //Checks which material to buy/invest
  if(GetBuying(args[0]) !== -1) {//oh nope this is different
    //ok that should work.
    let emAmt = Math.floor(args[1]/conversions[GetBuying(args[0])]/emvalue);
    let amt = parseInt(args[1]);
    let remain = amt-Math.floor(conversions[GetBuying(args[0])]*emvalue)*emAmt;
    amt = amt - remain;
    console.log(remain);
    if(amt <= 0 || isNaN(Math.floor(parseInt(args[1])))) return Message("Oof", `${args[1]} is not a valid number!`, message, "ee3333");
    if(!args[1] || args[1] === "" || args [1] === undefined || args[1] === null) return message.reply(`You gotta specify an amount to invest ...`); //overkill?
    if(emAmt <= 0){ 
        Message("Oof", "You wouldn't get anything out of this trade! Perhaps wait the for the value to change.", message, "eeee33");
      return;
    }
    if(I.li+3600000 > Date.now()){
      Message("Oof", `You must wait ${Math.floor((I.li+3600000-Date.now())/60000)} minutes!`, message, "ee3333");
      return;
    }
    //console.log(emAmt);
    if(GetBuying(args[0]) === 0) { //stone
      if(I.inv.stone < amt){Message("Uh oh!", `You don't have enough ${args[0]} !`, message, "ee3333");return;}
        I.inv.stone -= amt;
        I.inv.emerald += emAmt;
    }
    if(GetBuying(args[0]) === 1) { //coal
      if(I.inv.coal < amt){Message("Uh oh!", `You don't have enough ${args[0]} !`, message, "ee3333");return;}
        I.inv.coal -= amt;
        I.inv.emerald += emAmt;
    }
    if(GetBuying(args[0]) === 2) { //iron
      if(I.inv.iron < amt){Message("Uh oh!", `You don't have enough ${args[0]} !`, message, "ee3333");return;}
        I.inv.iron -= amt;
        I.inv.emerald += emAmt;
    }
    if(GetBuying(args[0]) === 3) { //gold
      if(I.inv.gold < amt){Message("Uh oh!", `You don't have enough ${args[0]} !`, message, "ee3333");return;}
        I.inv.gold -= amt;
        I.inv.emerald += emAmt;
    }
    if(GetBuying(args[0]) === 4) { //diamond
      if(I.inv.diamond < amt){Message("Uh oh!", `You don't have enough ${args[0]} !`, message, "ee3333");return;}
        I.inv.diamond -= amt;
        I.inv.emerald += emAmt;
    }
    if(GetBuying(args[0]) === 5) { //redstone
      if(I.inv.redstone < amt){Message("Uh oh!", `You don't have enough ${args[0]} !`, message, "ee3333");return;}
        I.inv.redstone -= amt;
        I.inv.emerald += emAmt;
    }
    if(GetBuying(args[0]) === 6) { //lapis
      if(I.inv.lapis < amt){Message("Uh oh!", `You don't have enough ${args[0]} !`, message, "ee3333");return;}
        I.inv.lapis -= amt;
        I.inv.emerald += emAmt;
    }
    console.log(I.inv.emeralds);
    Message("Yay!", `You invested ${amt} ${args[0]} and got ${emAmt} emerald in return! You also got ${remain} ${args[0]} back!`, message, "ee33ee");
    I.li = Date.now();
    investamt ++;
    if(investamt < -10) investamt = -10;
    if(investamt > 10) investamt = 10;
    updateInventory(I);
  } else {
      Message("Uh oh!", "That is not an investible material at this time!", message, "ee3333");
  }
};*/

//pfiscmd
let prefixes = require('./prefixes.json');
var setPrefix = async function(message, args) {
  if(!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send("You do not have the proper permissions!");
  let ruhrohembed = new Commando.RichEmbed()
    .setTitle("Uh Oh!")
    .setColor("FF0000")
    .setDescription("Usage: `kb!setprefix <newprefix>``");
    if(!args[0] || args[0] == "help") return message.channel.send(ruhrohembed);

    prefixes[message.guild.id] = {
        prefix: args[0]
    }

    await fs.writeFile("./prefixes.json", JSON.stringify(prefixes, null, 4), (err) => {
        if(err) console.log(err);
    });
  
    let sEmbed = new Commando.RichEmbed()
        .setColor(`RANDOM`)
        .setTitle("Prefix Change")
        .setDescription(`Your prefix was set to \`${args[0]}\``);

    await message.channel.send(sEmbed);
}
var Prefix = async function(message, args) {
  let emb = new Commando.RichEmbed()
    .setTitle(message.guild.name)
    .setColor(`RANDOM`)
    .setDescription(`Your prefix is \`${prefixes[message.guild.id].prefix}\``)
    .setFooter(`You can change this by runnng \`${prefixes[message.guild.id].prefix}setprefix <newprefix>\``);
  await message.channel.send(emb);
}
//em value
/*var EmValueCommand = function(message, args){
  var yourarray = findYourId(message.author.id);
  if(yourarray == -1){
      makeNewInventory(message);
      yourarray = Invs.length-1;
      console.log("User " + Invs[Invs.length-1].id + " Created!");
  }
  var I = Invs[yourarray];
  updateInventory(I); //you'll need this to access the inventory of the user
  
  if(I.level < 5){
    Message("Uh oh!", "You must be level 5 to use the value command!", message, "ee3333");
    return;
  }
  
  var M = "";
  for(var i = 0;i < materialsToBuy.length;i ++){
    if(conversions[i] < 1){
      M +=`${materialsToBuy[i]}1 = ${Math.floor(1/conversions[i])}${emerald}\n`;
    }
    else{
      M +=`${materialsToBuy[i]}${Math.floor(conversions[i]*1)} = 1 ${emerald}\n`;
    }
  }
  Message("Emerald Value", `An Emerald is **${Math.floor(emvalue*100)}%** of its regular value\nRegular Values:\n${M}`, message, "33ee33");
};*/
/*var BrewCommand = function(message, args){
  var yourarray = findYourId(message.author.id);
  if(yourarray == -1){
      makeNewInventory(message);
      yourarray = Invs.length-1;
      console.log("User " + Invs[Invs.length-1].id + " Created!");
  }
  var I = Invs[yourarray];
  updateInventory(I);
  if(I.canbrew === 0){
    Message("Uh oh!", "You don't have a brewing stand yet! Do kb!craft brewingstand", message, "ee3333");
    return;
  }
  if(args[0] === undefined || args[0] == ""){ 
        var brewrecipes = "";
        for(var i = 0;i < potions.length;i ++){
          if(potions[i].cost1 === "gold"){
            brewrecipes +=Gold;
          }
          if(potions[i].cost1 === "lapis"){
            brewrecipes +=Lapis;
          }
          if(potions[i].cost1 === "quartz"){
            brewrecipes +=Quartz;
          }
          brewrecipes +=" **" + potions[i].cost2 + "** :arrow_forward: " + potions[i].pic + " " + potions[i].name + " - " + potions[i].info + " - Do `kb!brew " + potions[i].tag + "`";
          brewrecipes +="\n";
        }
        let brewEmbed = new Commando.RichEmbed() 
            .setTitle(`**${I.name}'s inventory**`)
            .setColor("22ff88")
            .setTimestamp()
            .setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL)
            .addField(`Welcome to Brewing!`, "You can do `kb!brew <potion-name>` to brew a potion! You may require different materials!", false)
            .addField(`Recipes:`, brewrecipes, true);
        message.channel.send(brewEmbed);
  }
  for(var i = 0;i < potions.length;i ++){
    if(args[0] == potions[i].tag){
      var potionsuccessful = false;
      if(potions[i].cost1 === "gold"){
        if(I.inv.gold >= potions[i].cost2){
          I.inv.gold -=potions[i].cost2;
          potionsuccessful = true;
        }
        else{
          Message("Uh oh!", "You need " + (potions[i].cost2-I.inv.gold) + " more " + Gold, message, "ee3333");
        }
      }
      if(potions[i].cost1 === "lapis"){
        if(I.inv.lapis >= potions[i].cost2){
          I.inv.lapis -=potions[i].cost2;
          potionsuccessful = true;
        }
        else{
          Message("Uh oh!", "You need " + (potions[i].cost2-I.inv.lapis) + " more " + Lapis, message, "ee3333");
        }
      }
      if(potions[i].cost1 === "quartz"){
        if(I.inv.quartz >= potions[i].cost2){
          I.inv.quartz -=potions[i].cost2;
          potionsuccessful = true;
        }
        else{
          Message("Uh oh!", "You need " + (potions[i].cost2-I.inv.quartz) + " more " + Quartz, message, "ee3333");
        }
      }
      if(potionsuccessful){
        if(I.pots[i] < Date.now()){
            I.pots[i] = Date.now()+360000;
            Message("Potion Created!", "You've created your " + potions[i].name + " Potion! It will last for 5 minutes!", message);
          }
          else{
            I.pots[i] +=360000;
            Message("Potion Extended", "You've extended your " + potions[i].name + " Potion by another 5 minutes!", message);
          }
      }
    }
  }
};*/
/** MESSAGE FUNCTION */
/*dbl.webhook.on('ready', hook => {
  console.log(`Webhook running at http://${hook.hostname}:${hook.port}${hook.path}`);
});
dbl.webhook.on('vote', vote => {
  var VotedUser = vote.user;
  var theinv = -1;
  console.log(`User with ID ${vote.user} just voted!`);
  try{
    for(var i = 0;i < Invs.length;i ++){
      if(Invs[i].id === VotedUser.toString()){
        theinv = i;
        var I = Invs[i];
        I.crates ++; 
        bot.users.get(VotedUser).send("You got a Lootbox! Thanks a lot for voting and vote again for another lootbox later! " + lootbox);
      }
    }
    if(theinv === -1){
      makeNewInventory("unknown", VotedUser, VotedUser.toString());
        var I = Invs[Invs.length-1];
        I.crates ++; 
        bot.users.get(VotedUser).send("You got a Lootbox! Thanks a lot for voting and vote again for another lootbox later! " + lootbox);
    }
  }
  catch(error){
    console.log('Uh oh! ' + error);
  }
});
dbl.webhook.on('error', e => {
 console.log(`Oops! ${e}`);
});*/
var bottype = 2;
bot.on('error', error => { console.log(error);});
bot.on('message', message => {
  if(message.channel.type === 'dm'){ return;}
  if(!prefixes[message.guild.id]){ 
    prefixes[message.guild.id] = { 
      prefix: "kb!" 
    } //Line 3501
  }
  //if(message.guild.id !== "") return;
  if(message.author.id !== bot.user.id && message.author.bot) return;
    var checkPrefixMessage = message.toString();
    checkPrefixMessage = checkPrefixMessage.toLowerCase();
    //var Member = message.guild.members.get(message.author.id);
    if(checkPrefixMessage.startsWith(prefixes[message.guild.id].prefix)) { //Checks if the user is in a DM or is using the kb! thingy
        if(maintenance === false || (maintenance === true)){
            if(maintenance && message.author.id !== "374929883698036736" && message.author.id !== "499882708860665856"){
              return;
            }
            var fullCmd;
            if (checkPrefixMessage.startsWith(prefixes[message.guild.id].prefix)) { //<--------------
                var fullCmd = message.content.slice((prefixes[message.guild.id].prefix).length); //takes out kb! for checking the command
            } else {
                fullCmd = message.content; //message stays as it is
            }
            var nameCmd = fullCmd.split(' ')[0]; //gets the name of the command
            var args = fullCmd.replace(nameCmd, ''); //gets the args and takes out the name of the command
            nameCmd = nameCmd.toLowerCase(); //converts the command to lowercase, so Flip and flip will work for example.
            args = args.slice(1); //takes out the space before the args
            args = args.split(' ');
            if(nameCmd === "about" || nameCmd === "ab"){
                AboutCommand(message);
            }
            else if(nameCmd === "setprefix") {
                setPrefix(message, args);
            }
            else if(nameCmd === "tutorial" || nameCmd === "start"){
                TutorialCommand(message);
            }
            else if(nameCmd === "server"){
                ServerCommand(message);
            }
            else if(nameCmd === "vote" || nameCmd === "v"){
                VoteCommand(message);
            }
            else if(nameCmd === "prefix") {
                Prefix(message);
            }
            else if(nameCmd === "help" || nameCmd === "h"){
                HelpCommand(message, args);
            }
            else if(nameCmd === "invite"){
                InviteCommand(message);
            }
            else if(nameCmd === "stats"){
                StatsCommand(message);
            }
            else if(nameCmd === "enchant" || nameCmd === "enchants" || nameCmd === "shop"){
                ShopCommand(message, args);
            }
            else if(nameCmd === "mine" || nameCmd === "m"){
                MineCommand(message, args);
            }
            else if(nameCmd === "inv" || nameCmd === "inventory"){
                InvCommand(message, args);
            }
            else if(nameCmd === "regenland" || nameCmd === "rl"){
                RegenLandCommand(message, args);
            }
            else if(nameCmd === "trade"){
                TradeCommand(message, args);
            }
            else if(nameCmd === "backup" && (message.author.id.toString() === '374929883698036736' || message.author.id.toString() === "542878436885266474") && message.channel.type === "dm"){
                BackupCommand(message, args);
            }
            else if(nameCmd === "backup" && (message.member.roles.find(r => r.name === "Backup-ers") && message.guild.id === "550036987772403714") && message.channel.type !== "dm"){
                BackupCommand(message, args);
            }
            else if(nameCmd === "backup"){
                message.reply("This only works in the Kepler Miner Server and you have the Backup-ers role! Or if you are KeplerTeddy in DM");
            }
            else if(nameCmd === "craft"){
                CraftCommand(message, args);
            }
            else if(nameCmd === "toplist" || nameCmd === "top" || nameCmd === "lb"){
                TopListCommand(message, args);
            }
            else if(nameCmd === "pickaxe"){
                PickaxeCommand(message, args);
            }
            else if(nameCmd === "changelog"){
                ChangeLogCommand(message, args);
            }
            else if(nameCmd === "crate" || nameCmd === "crates" || nameCmd === "lootbox" || nameCmd === "lootboxes"){
                CrateCommand(message, args);
            }
            else if(nameCmd === "add-items" || nameCmd === "additems" || nameCmd === "add"){
                AddItemsCommand(message, args);
            }
            else if(nameCmd === "give" || nameCmd === "pay") {
                GiveCommand(message, args);
            }
            else if(nameCmd === "resetminerscore" && message.author.id.toString() === '374929883698036736'){
              ResetMinerScoreCommand(message, args);
            }
        }
        else if(maintenance === true){
        }
    }
    else{
        return;
    }
});

/** WHEN THE BOT IS READY DO THIS */
bot.on("ready", function() {
  console.log(bot.users.size);
  /*setInterval(() => {
    if (emvalue <= 0.3) {
      emvalue += investamt / 100 + Math.random() * 0.1;
      console.log(`Emerald Value is now ${emvalue}`);
    } else if (emvalue <= 0.6) {
      emvalue += investamt / 100 + -0.025 + Math.random() * 0.1;
      console.log(`Emerald Value is now ${emvalue}`);
    } else if (emvalue <= 1.4) {
      emvalue += investamt / 100 + -0.05 + Math.random() * 0.1;
      console.log(`Emerald Value is now ${emvalue}`);
    } else if (emvalue <= 2) {
      emvalue += investamt / 100 + -0.075 + Math.random() * 0.1;
      console.log(`Emerald Value is now ${emvalue}`);
    } else if (emvalue <= 3) {
      emvalue += investamt / 100 + -0.1 + Math.random() * 0.1;
      console.log(`Emerald Value is now ${emvalue}`);
    }
    if (emvalue < 0.3) {
      emvalue = 0.3;
    }
    if (emvalue > 3) {
      emvalue = 3;
    }
  }, 300000);*/
  setInterval(() => {
    //dbl.postStats(bot.guilds.size);
    if (!maintenance) {
      if (bottype === 0) {
        bottype++;
        bot.user
          .setActivity(bot.guilds.size + " Servers | kb!start", {
            type: "WATCHING"
          })
          .then(presence => console.log(`Activity set!`))
          .catch(console.error);
        return;
      }
      if (bottype === 1) {
        bottype = 0;
        bot.user
          .setActivity(Invs.length + " Miners | kb!start", { type: "WATCHING" })
          .then(presence => console.log(`Activity set!`))
          .catch(console.error);
        return;
      }
    }
  }, 600000);
  setInterval(() => {
    BackupQuick();
  }, 60000);
  if (maintenance) {
    bot.user
      .setActivity("In Maintenance!", { type: "LISTENING" })
      .then(presence => console.log(`Activity set!`))
      .catch(console.error);
  } else {
    bot.user
      .setActivity(bot.guilds.size + " Servers | kb!help", { type: "WATCHING" })
      .then(presence => console.log(`Activity set!`))
      .catch(console.error);
  }
  console.log("Bot is now on with server ");
});

bot.login(process.env.TOKEN);

