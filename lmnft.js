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
       if(url.startsWith('https://mint.creatormachine.com/')) {
        axios.get(url).then(response =>{

            const html = response.data ;
            const $ = cheerio.load(html);
            const json = JSON.stringify(response.data);
            const obj = JSON.parse(json);
            const prettyhtml = pretty(obj);
            //console.log(prettyhtml);
    
            var parsedHTML = $.load(prettyhtml);
            var folder = parsedHTML('script').get()[10].attribs['src']
    
            console.log(folder)
    
            let Full = url + folder;
            console.log(Full);
    
            axios.get(Full).then(response =>{
    
                let info = response.data
                console.log(typeof info);
                let $2 = cheerio.load(info);
                let respjson = JSON.stringify(info);
                let obje = JSON.parse(respjson);
                
    
                //console.log(typeof obje);
    
                let substring = 'r.rV.PublicKey';
                
                console.log(info.includes(substring));
    
    
                const split1 = obje.split('r.rV.PublicKey("',)[1];
                //console.log(obje.split('r.rV.PublicKey("' )[1]);
                const CMID = split1.split('")')[0];
                console.log(CMID)
                message.channel.send('```' + CMID + '```');
                    
    
                
            }) 
        });

         } else {
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
                        console.log('its a string');
                        const removeit = split1.split(' "')[0];
                        
                        const removeit2 = removeit.replace('",', '\n\n');
                        const removeit3 = removeit2.slice(0, removeit2.lastIndexOf('\n\n'));
                        
                        console.log(pretty('CMID: ' + removeit3));
                        message.channel.send('```' + removeit3 + '```');
                        
                
                
                    } else {
                        console.log('not string')
                    }
                    
                    
                
                
                });
            }
            }
   }
});

client.login(token);