import { Telegraf, Context } from 'telegraf';
import { Update } from 'telegraf/typings/core/types/typegram';
import { AppConfig } from './config';

const bot = new Telegraf<Context<Update>>(AppConfig.ApiToken);

bot.start((ctx) => ctx.reply('Welcome!'));

bot.telegram.setMyCommands([{ command: 'start', description: 'Hello world!' }]);

bot.launch();
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

console.log('DeFi Notifications Bot is running!');
