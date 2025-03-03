import axios from 'axios';
import { AttachmentBuilder } from 'discord.js';

export const sendGeneratedTextMessage = async (userQuery, message) => {
  const response = await axios.post(
    'https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1', // Replace with the model you're using
    {
      inputs: `Answer only the following question concisely, without adding extra information: ${userQuery}`, // Prompt engineering
      parameters: {       
        max_new_tokens: 200,      // Reduce to limit verbosity 
        temperature: 0.1,         // Lower for less creativity, more focus
        top_p: 0.85,              // Tighten sampling for relevance
        return_full_text: false   // Only return generated text, not the prompt
      }
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,  // Use your Hugging Face API key here 
         'Content-Type': 'application/json' 
      },
    }
  );

  const modelResponse = response.data[0].generated_text;
  return message.reply(modelResponse);
}

export const sendGeneratedImage = async (prompt, message) => {
  const response = await axios({
    method: 'post',
    url: 'https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5', // Replace with the model you're using
    headers: {
      Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`, // Use your Hugging Face API key here 
      'Content-Type': 'application/json'
    },
    data: {
      inputs: prompt, 
    },
    responseType: 'arraybuffer'
  });

  const attachment = new AttachmentBuilder(response.data, { name: 'generated_image.png' });
  return message.reply({ files: [attachment] });
}