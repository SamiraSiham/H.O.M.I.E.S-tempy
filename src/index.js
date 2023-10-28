import { config } from "dotenv";
import { Client, Collection } from "discord.js";
// const {ChannelType} = require('discord.js');
import { ChannelType, PermissionFlagsBits } from "discord.js";

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
            PermissionFlagsBits.UseExternalStickers,
          ],
          deny: [PermissionFlagsBits.ManageChannels],
        },
        {
          id: guild.id,
          allow: [
            PermissionFlagsBits.ViewChannel,
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
            PermissionFlagsBits.UseExternalStickers,
          ],
        },
      ],
    });
    voiceManager.set(member.id, voiceChannel.id);

    return setTimeout(async () => {
      member.voice.setChannel(voiceChannel);
    }, 600);
  }

  // if user leaves or switches channel
  const JTCCHANNEL = voiceManager.get(member.id);
  const members = oldChannel?.members
    .filter((m) => !m.user.bot)
    .map((m) => m.id);
  // allow other members to speak
  // oldChannel.permissionOverwrites.edit(guild.members.cache.get(members),{
  //   Connect : true,
  //   Speak : true
  // })

  if (
    JTCCHANNEL &&
    oldChannel.id === JTCCHANNEL &&
    (!newChannel || newChannel.id !== JTCCHANNEL)
  ) {
    if (members.length > 0) {
      let randomId = members[Math.floor(Math.random() * members.length)];
      let randomMember = guild.members.cache.get(randomId);
      randomMember.voice.setChannel(oldChannel).then((v) => {
        randomMember.send(`you are now the owner of ${oldChannel}`);
        oldChannel.setName(randomMember.user.username).catch((e) => null);
        oldChannel.permissionOverwrites.edit(randomMember, {
          Connect: true,
          ManageChannels: true,
          Speak: true,
        });
      });
      voiceManager.set(member.id, null);
      voiceManager.set(randomMember.id, oldChannel.id);
    } else {
      voiceManager.set(member.id, null);
      oldChannel.delete().catch((e) => null);
    }
    // console.log(JTCCHANNEL);
  }
});

client.login(process.env.TOKEN).catch((e) => {
  console.log(e);
});
