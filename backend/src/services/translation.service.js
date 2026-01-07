import axios from "axios";
import { v4 as uuidv4 } from 'uuid';

/**
 * Translates text using Azure Translator API
 * @param {string} text - Text to translate
 * @param {string} toLanguage - Target language code (default: 'es')
 * @returns {Promise<string>} - Translated text
 */
export const translateText = async (text, toLanguage = "es") => {
  const key = process.env.AZURE_TRANSLATOR_KEY;
  const endpoint = process.env.AZURE_TRANSLATOR_ENDPOINT || "https://api.cognitive.microsofttranslator.com";
  const region = process.env.AZURE_TRANSLATOR_REGION; // Required for global resource

  if (!key || !region) {
    console.warn("Azure Translator credentials missing. Returning mock translation.");
    return `[Mock Translation to ${toLanguage}]: ${text}`;
  }

  try {
    const response = await axios({
      baseURL: endpoint,
      url: '/translate',
      method: 'post',
      headers: {
        'Ocp-Apim-Subscription-Key': key,
        'Ocp-Apim-Subscription-Region': region,
        'Content-type': 'application/json',
        'X-ClientTraceId': uuidv4().toString()
      },
      params: {
        'api-version': '3.0',
        'from': 'en',
        'to': toLanguage
      },
      data: [{
        'text': text
      }],
      responseType: 'json'
    });

    return response.data[0].translations[0].text;
  } catch (err) {
    console.error("Translation Error:", err.response?.data || err.message);
    throw new Error("Translation failed");
  }
};