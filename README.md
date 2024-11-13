# ollama-discord

A simple discord bot that can be used to chat with an ollama instance.

## Configuration

Create a `.env` file in the root directory of the project with the following content:

```
DISCORD_TOKEN=<discord-bot-token>
DISCORD_CLIENT_ID=<discord-client-id>
DISCORD_GUILD_ID=<discord-guild-id>

OLLAMA_API_URL=<ollama-server-url>
```

## Running the bot

To run the bot, simply run the following command:

```
npm start
```

Or with Docker:

```
docker compose up -d
```

## Commands

- **/start** : Select a model and start the conversation with the chatbot in a new thread.
- **/list-models** : List the available models
- **/create** : Create a new model from another one. You have to give a **name**, then fill the **form** field with a model from the list above or a model available on [ollama](https://ollama.com/search) and finally give a **modelfile** (example on [ollama documentation](https://github.com/ollama/ollama/blob/main/docs/modelfile.md)).

## Community

Join the [Ollama Discord server](https://discord.gg/TNEZ5b54BS) to chat with the Ollama community.
