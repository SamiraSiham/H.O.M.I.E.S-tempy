import {config} from 'dotenv';
import {Client,Collection} from 'discord.js';
// const {ChannelType} = require('discord.js');
import { ChannelType } from 'discord.js';

config();



const client = new Client({
    intents: ["Guilds" , "GuildMessages", "GuildMembers", "GuildVoiceStates"],
});


client.on("ready", async()=>{
    console.log(`bot is on ${client.user.tag}`);
});

let voiceManager = new Collection()

client.on('voiceStateUpdate', async(oldState, newState)=>{
    const {member, guild} = oldState;
    const newChannel = newState.channel;
    const oldChannel = oldState.channel;
    const join_to_create = "1162773476516560986";

    // if user joins voice channel
    if(oldChannel !== newChannel && newChannel.id === join_to_create){
        const voiceChannel = await guild.channels.create({
            name : `${member.user.username}`,
            type : ChannelType.GuildVoice,
            parent: newChannel.parent,
            PermissionOverWrites:[
                {
                    id : member.id,
                    allow: ['CONNECT','MANAGE_CHANNELS']
                },
                {
                    id: guild.id,
                    allow: ['CONNECT']
                }
            ]
        });

        voiceManager.set(member.id,voiceChannel.id);

        // spam protection
        await newChannel.permissionOverwrites.edit(member,{Connect : false})
        setTimeout(()=>{
            newChannel.permissionOverwrites.delete(member)
        }, 30*1000);
        return setTimeout(()=>{
            member.voice.setChannel(voiceChannel);
        }, 600);
    }else{
        console.log(newChannel.id);
    }
})



client.login(process.env.TOKEN).catch((e)=>{
    console.log(e);
});