const { SlashCommandBuilder } = require('discord.js')
const dotenv = require('dotenv')
dotenv.config()
const api_url = process.env.OLLAMA_API_URL

module.exports = {
  data: new SlashCommandBuilder()
    .setName('list-models')
    .setDescription('List available models.'),
  async execute(interaction) {
    await interaction.reply('Fetching available models...')

    fetch(api_url + '/api/tags')
      .then((response) => response.json())
      .then((data) => {
        const models = data.models
        let response = 'Available models:\n'
        models.forEach((model) => {
          response += `- **${model.name}**\n`
        })
        interaction.followUp(response)
      })
  },
}
