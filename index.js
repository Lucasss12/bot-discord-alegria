require('dotenv').config();
const { Client, GatewayIntentBits, SlashCommandBuilder, REST, Routes } = require('discord.js');
const express = require('express');
const commandsData = require('./responses.json'); 

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

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

  const command = commandsData.find(cmd => cmd.name === interaction.commandName);
  if (command) {
    await interaction.reply({
      content: command.response,
      files: command.image ? [command.image] : [],
    });
  } else {
    await interaction.reply("Commande non reconnue.");
  }
});

client.login(process.env.DISCORD_TOKEN);

console.log('Bot connecté avec succès !');

const app = express();
app.use('/images', express.static('images'));
app.get('/', (_, res) => res.send('Bot is running'));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Keep-alive actif sur ${PORT}`));