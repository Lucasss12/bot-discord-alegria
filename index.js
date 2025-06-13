require('dotenv').config();
const { Client, GatewayIntentBits, SlashCommandBuilder, REST, Routes } = require('discord.js');
const express = require('express');
const commandsData = require('./commands.json'); // Charger les commandes depuis le fichier JSON

// Création du client Discord
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Définition des commandes slash à partir du fichier JSON
const commands = commandsData.map(command => 
  new SlashCommandBuilder()
    .setName(command.name)
    .setDescription("Réponse en cours...")
    .toJSON()
);

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
      { body: commands }
    );
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement des commandes :', error);
  }
})();

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  // Trouver la commande correspondante dans le fichier JSON
  const command = commandsData.find(cmd => cmd.name === interaction.commandName);
  if (command) {
    await interaction.reply(command.response);
  } else {
    await interaction.reply("Commande non reconnue.");
  }
});

client.login(process.env.DISCORD_TOKEN);

const app = express();
app.get('/', (_, res) => res.send('Bot is running'));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Keep-alive actif sur ${PORT}`));