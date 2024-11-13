const { SlashCommandBuilder } = require('discord.js')
const dotenv = require('dotenv')
dotenv.config()
const api_url = process.env.OLLAMA_API_URL

module.exports = {
  data: new SlashCommandBuilder()
    .setName('create-model')
    .setDescription('Create a new model.')
    .addStringOption((option) =>
      option
        .setName('name')
        .setDescription('Name of the model')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('from')
        .setDescription('A model available in `/list-models`')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('system-prompt')
        .setDescription('The prompt used to define the model')
        .setRequired(true)
    ),
  async execute(interaction) {
    const name = interaction.options.getString('name')
    const from = interaction.options.getString('from')
    const system_prompt = interaction.options.getString('system-prompt')

    const modelfile = `FROM ${from}\nSYSTEM ${system_prompt}`
    console.log(modelfile)

    await interaction.reply('Creating model...')

    fetch(api_url + '/api/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name,
        modelfile: modelfile,
      }),
    }).then((response) => {
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let data = ''

      reader.read().then(function processText({ done, value }) {
        if (done) {
          console.log(data)
          return
        }

        data += decoder.decode(value, { stream: true })
        return reader.read().then(processText)
      })
    })
  },
}
