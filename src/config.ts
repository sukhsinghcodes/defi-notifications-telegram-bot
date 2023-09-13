import dotenv from 'dotenv';

dotenv.config();

export const AppConfig = {
  ApiToken: process.env.BOT_API_TOKEN || '',
};
