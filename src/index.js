import { config } from "dotenv";
import { Client, Collection } from "discord.js";
// const {ChannelType} = require('discord.js');
import {
  ChannelType,
  PermissionFlagsBits,
} from "discord.js";

config();

const client = new Client({
  intents: ["Guilds", "GuildMessages", "GuildMembers", "GuildVoiceStates"],
});

client.on("ready", async () => {
  console.log(`${client.user.tag} is online !`);
});

let voiceManager = new Collection();

client.on("voiceStateUpdate", async (oldState, newState) => {
  const { member, guild } = oldState;
  const newChannel = newState.channel;
  const oldChannel = oldState.channel;
  const join_to_create = "1162773476516560986";

  // if user joins voice channel
  if (
    oldChannel !== newChannel &&
    newChannel &&
    newChannel.id === join_to_create
  ) {
    const voiceChannel = await guild.channels.create({
      name: `${member.user.username}`,
      type: ChannelType.GuildVoice,
      parent: newChannel.parent,
      permissionOverwrites: [
        {
          id: member.id,
          allow: [
            PermissionFlagsBits.Connect,
            PermissionFlagsBits.ReadMessageHistory,
            PermissionFlagsBits.Speak,
            PermissionFlagsBits.AddReactions,
            PermissionFlagsBits.AttachFiles,
            PermissionFlagsBits.CreateInstantInvite,
            PermissionFlagsBits.KickMembers,
            PermissionFlagsBits.UseSoundboard,
            PermissionFlagsBits.Stream,
            PermissionFlagsBits.UseVAD,
            PermissionFlagsBits.UseApplicationCommands,
            PermissionFlagsBits.UseEmbeddedActivities,
            PermissionFlagsBits.UseExternalEmojis,
            PermissionFlagsBits.UseExternalStickers
          ],
          deny: [PermissionFlagsBits.ManageChannels],
        },
        {
          id: guild.id,
          allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.Connect],
        },
      ],
    });
    voiceManager.set(member.id, voiceChannel.id);

    // spam protection
    // await newChannel.permissionOverwrites.edit(member, { Connect: false });
    // setTimeout(() => {
    //   newChannel.permissionOverwrites.delete(member);
    // }, 3 * 1000);
    return setTimeout(async () => {
      member.voice.setChannel(voiceChannel);
    }, 600);
  }
  // if user leaves or switches channel
  const JTCCHANNEL = voiceManager.get(member.id);
  if (
    JTCCHANNEL &&
    oldChannel.id === JTCCHANNEL &&
    (!newChannel || newChannel.id !== JTCCHANNEL)
  ) {
    // console.log(JTCCHANNEL);
    voiceManager.set(member.id, null);
    oldChannel.delete().catch((e) => null);
  }
});

client.login(process.env.TOKEN).catch((e) => {
  console.log(e);
});
