import 'dotenv/config';
import { Client, GatewayIntentBits } from 'discord.js';
import { sendGeneratedTextMessage, sendGeneratedImage } from './services/api.js';

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

client.once('ready', () => {
  console.log(`🤖 Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return; 

  if (message.content.startsWith('!ask')) {
    const userQuery = message.content.replace('!ask', '').trim();
    if (!userQuery) return message.reply('Please provide a question!');
  
    try {
      await sendGeneratedTextMessage(userQuery, message)
    } catch (error) {
      console.error('Error with Hugging Face API:', error.response ? error.response.data : error.message);
      await message.reply('An error occurred while generating the response. Please try again later.');
    }
  } 

  if (message.content.startsWith('!generate')) {
    const prompt = message.content.replace('!generate', '').trim();
    if (!prompt) return message.reply('Please provide a prompt for image generation!');
  
    try {
      await sendGeneratedImage(prompt, message)
    } catch (error) {
      console.error('Error generating image:', error.response ? error.response.data : error.message);
      await message.reply('An error occurred while generating the image. Please try again later.');
    }
  }
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled promise rejection:', error);
});

client.login(process.env.DISCORD_BOT_TOKEN);