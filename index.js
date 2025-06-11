require('dotenv').config();
const { Client, GatewayIntentBits, SlashCommandBuilder, REST, Routes } = require('discord.js');
const express = require('express');

// Création du client Discord
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Définition des commandes slash
const commands = [
  new SlashCommandBuilder()
    .setName('google-make')
    .setDescription('Réponse à la question de google-make')
    .toJSON(),

  new SlashCommandBuilder()
    .setName('test')
    .setDescription('Réponse à la question de test')
    .toJSON()
];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
      { body: commands }
    );
  } catch (error) {
  }
})();

client.on('ready', () => {
  console.log(`🤖 Connecté en tant que ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'google-make') {
    await interaction.reply(`Bonjour @user 👋,\n\nJe te partage avec plaisir ce tutoriel de Jeff. Il est à jour et vraiment très clair. Prends le temps de le suivre à ton rythme, et surtout, sache que si tu rencontres la moindre difficulté ou si tu as des interrogations, je suis disponible pour t'aider. N'hésite surtout pas ! 👍 \nhttps://www.youtube.com/watch?v=esr3h3PHaQk`);
  }

  if (interaction.commandName === 'test') {
    await interaction.reply(`Bonjour test OK 123`);
  }
});

client.login(process.env.DISCORD_TOKEN);
 
// Express server pour keep-alive
const app = express();
app.get('/', (_, res) => res.send('Bot is running'));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Keep-alive actif sur ${PORT}`));