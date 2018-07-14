// © Nathan ROTH - github@NathanRth
// 07/2018
// ScoreBoard - a Disord bot

const Discord = require('discord.js');
const Low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('dataBase.json');
const db = Low(adapter)

const bot = new Discord.Client();


var prefix = ("!");

db.defaults({factions:[]}).write();

bot.on('message', function(message){


    argv = message.content.split(" ")
    let cmd = argv[0];
    let faction = argv[1];
    let val = argv[2];

    switch(cmd){
    case '!test':
        if(isChief(message)){
            message.reply("hello admin");
        }else{
            message.reply("you dont have permission to use this command")
        }
    break;
    case '!add':
        try{
            db_add(faction, val);
        }catch(e){
            message.reply(e);
            break;
        }
        message.reply('La faction **'+faction+'** a maintenant '+ db_get(faction)+' points.');
    break;
    case '!rem':
        try{
            db_rem(faction, val);
        }catch(e){
            message.reply(e);
            break;
        }
        message.reply('La faction **'+faction+'** a maintenant '+ db_get(faction)+ ' points.');
    break;
    case '!set':
        try{
            db_set(faction, val);
        }catch(e){
            message.reply(e);
            break;
        }
        message.reply('La faction **'+faction+'** a maintenant '+ db_get(faction)+ ' points.');
    break;
    case '!get':
        try{
            db_get(faction);
        }catch(e){
            message.reply(e);
            break;
        }
        message.reply('La faction **'+faction+'** a '+ db_get(faction)+ ' points.');
    break;
    case '!create':
        try{
            db_create(faction);
        }catch(e){
            message.reply(e);
            break;
        }
        message.reply('La faction **'+faction+'** a été crée !');
    break;
    case '!delete':
        try{
            db_delete(faction);
        }catch(e){
            message.reply(e);
            break;
        }
        message.reply('La faction **'+faction+'** a été supprimée !');
    break;
    case '!score':
        message.reply(score());
    break;
    case '!help':
        message.channel.send(help());
    break;
    }
});

function db_add(faction, val)
{
    if(val){
        var info = db.get('factions').find({name:faction}).value();
        if(info){
            info['points']+=parseInt(val);
            db.get('score').find({name:faction}).assign({info}).write();
        }
        else{
            throw "Oups! Cette faction n'existe pas";
        }
    }else{
        throw "Aucune valeur spécifiée";
    }
}

function db_rem(faction, val)
{
    if(val){
        var info = db.get('factions').find({name:faction}).value();
        if(info){
            info['points']-=parseInt(val);
            db.get('score').find({name:faction}).assign({info}).write();
        }
        else{
            throw "Oups! Cette faction n'existe pas";
        }
    }else{
        throw "Aucune valeur spécifiée";
    }
}

function db_set(faction, val)
{
    if(val){
        var info = db.get('factions').find({name:faction}).value();
        if(info){
            info['points']=parseInt(val);
            db.get('score').find({name:faction}).assign({info}).write();
        }
        else{
            throw "Oups! Cette faction n'existe pas";
        }
    }else{
        throw "Aucune valeur spécifiée";
    }
}

function db_get(faction)
{
    var info = db.get('factions').find({name:faction}).value();
    if(info != undefined){
        return info['points'];
    }
    else{
        throw "Oups! Cette faction n'existe pas !";
    }
}

function db_create(faction)
{
    // si existe déjà
    if(db.get('factions').find({name:faction}).value()){
        throw "Oups! Cette faction existe déjà !";
    }else{
        db.get('factions').push({name:faction, points:0}).write();
    }
}

function db_delete(faction)
{
    if(db.get('factions').find({name:faction}).value()){
        db.get('factions').remove({name:faction}).write();
    }else{
        throw "Oups! Cette faction n'éxiste pas !";
    }
}

function score()
{
    var list = db.get('factions').sortBy('points').value();
    var max = maxOf(list);
    var resp = "```\n";
    //return JSON.stringify(list);
    for(var i = list.length-1; i >= 0; i--){
        resp += list[i]["name"]+'\n';
        var points = parseInt(list[i]["points"]);
        var bars = (points/max)*10;
        for(var j = 0; j<bars;j++){
            resp += "█";
        }
        resp += ' '+points+'\n';
    }
    resp += "```"
    return resp;
}

function help()
{
    var embed = new Discord.RichEmbed()
        .setTitle("Aide")
        .setDescription("Faites comme dans Harry Potter et donnez des points à vos factions !")
        .addField("`!create <faction>`", "Créer une faction [admin]",false)
        .addField("`!delete <faction>`","Supprimer une faction [admin]",false)
        .addField("`!add <faction> <val>`","Ajouter <val> points à la faction <faction> [chef|admin]",false)
        .addField("`!rem <faction> <val>`","Retirer <val> points à la faction <faction> [chef|admin]",false)
        .addField("`!set <faction> <val>`","Ecraser le compteur de <faction> et le réinitialiser à <val> points [admin]",false)
        .addField("`!score`","Affiche le score [tous]",false)
        .addField("`!help`","Affiche les commandes [tous]",false)
    return embed;
}

function maxOf(obj)
{
    var max = 0;
    for(var i = 0; i < obj.length; i++){
        if(obj[i]['points'] > max){
            max = obj[i]['points'];
        }
    }
    return max;
}


    
function isAdmin(msg)
{
    let adminRole = msg.guild.roles.find('name','Admin');
    if(msg.member.roles.has(adminRole.id)){
        return true;
    }
    return false;
}

function isChief(msg)
{
    let chefsRougesRole = msg.guild.roles.find('name', 'Chefs Rouges');
    let chefsJaunesRole = msg.guild.roles.find('name', 'Chefs Jaunes');
    let chefsBleusRole = msg.guild.roles.find('name', 'Chefs Bleus');
    if(msg.member.roles.has(chefsBleusRole.id) || msg.member.roles.has(chefsJaunesRole.id) || msg.member.roles.has(chefsRougesRole.id)){
        return true;
    }
    return false;
}



bot.login(BOT_TOKEN);