const axios = require('axios');
const cheerio = require('cheerio');
var pretty = require('pretty');
const Discord = require('discord.js');
const { token } = require('./config.json');

const client = new Discord.Client({
    intents: [
        "GUILDS",
        "GUILD_MESSAGES"
    ]     
});

const prefix = '!';

client.on('ready', () => {
   console.log('SSD Bot is online!')
});

client.on('message', message =>{
   if(!message.content.startsWith(prefix) || message.author.bot) return;

   const args = message.content.slice(prefix.length).split(/ + /);
   const command = args.shift().toLowerCase();

   if(message.content.startsWith(`${prefix}CMID`)) {
       let url = message.content.split('!CMID')[1].trim();
       if(url.startsWith('https://launchmynft.io/collections/')) {
            axios.get(url).then(response =>{

                const html = response.data ;
                let respjson = JSON.stringify(html);
                let obj = JSON.parse(respjson);
            
                let substring = '"newCandyMachineAccountId":';
            
                console.log(obj.includes(substring));
            
                const split1 = obj.split('"newCandyMachineAccountId":"',)[1];
                //console.log(split1);
            
                if (typeof split1 === 'string') {
                    //console.log('bingo');
                    const removeit = split1.split(' "')[0];
                    
                    const removeit2 = removeit.replace('",', '\n\n');
                    const removeit3 = removeit2.slice(0, removeit2.lastIndexOf('\n\n'));
                    
                    console.log(pretty('CMID: ' + removeit3));
                    message.channel.send('```' + removeit3 + '```');
                    
                } else {
                    console.log('not found');
                }
       
            });
        }      
   }
});

client.login(token);