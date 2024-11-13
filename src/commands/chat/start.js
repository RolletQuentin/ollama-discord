const {
  SlashCommandBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
} = require('discord.js')
const dotenv = require('dotenv')
dotenv.config()
const api_url = process.env.OLLAMA_API_URL

module.exports = {
  data: new SlashCommandBuilder()
    .setName('start')
    .setDescription('Select a model to chat with.'),
  async execute(interaction) {
    await interaction.reply('Fetching available models...')

    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => {
        controller.abort()
      }, 5000) // 5 seconds timeout

      const response = await fetch(api_url + '/api/tags', {
        signal: controller.signal,
      })
      clearTimeout(timeout)

      const data = await response.json()
      const models = data.models

      const options = models.map((model) => ({
        label: model.name,
        value: model.name,
      }))

      const row = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId('select-model')
          .setPlaceholder('Select a model')
          .addOptions(options)
      )

      await interaction.followUp({
        content: 'Please select a model:',
        components: [row],
      })

      // create a thread for the user to chat with the selected model
      const filter = (i) => i.customId === 'select-model'
      const collector = interaction.channel.createMessageComponentCollector({
        filter,
        time: 15000, // 15 seconds
      })

      collector.on('collect', async (i) => {
        await i.deferUpdate()

        const selectedModel = models.find((model) => model.name === i.values[0])
        const randomNum = Math.floor(Math.random() * 1000)
        await interaction.channel.threads.create({
          name: selectedModel.name + '#' + randomNum,
          autoArchiveDuration: 60,
          type: 11,
        })

        collector.stop()
      })
    } catch (error) {
      if (error.name === 'AbortError') {
        await interaction.followUp('Request timed out. Please try again.')
      } else {
        await interaction.followUp('An error occurred. Please try again.')
      }
    }
  },
}
