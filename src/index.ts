import { Telegraf, Context, Markup } from 'telegraf';
import { Update } from 'telegraf/typings/core/types/typegram';
import { AppConfig } from './config';

const bot = new Telegraf<Context<Update>>(AppConfig.ApiToken);

bot.start(async (ctx) => {
  try {
    if (ctx.chat.type !== 'private') {
      ctx.sendMessage(
        'To get started and setup a notification, tap on "Setup" below.',
        Markup.inlineKeyboard([Markup.button.callback('Setup', 'setup')]),
      );
      return;
    }

    ctx.telegram.sendMessage(ctx.from.id, 'Setup a notification for yourself', {
      parse_mode: 'Markdown',
      reply_markup: Markup.inlineKeyboard([
        Markup.button.webApp('Setup', `${AppConfig.WebAppUrl}&chatId=${ctx.chat.id}`),
      ]).reply_markup,
    });
  } catch (err) {
    console.log('An error occured when executing the start command', err);
  }
});

bot.action('setup', async (ctx) => {
  const chat = ctx.callbackQuery?.message?.chat;

  if (!chat) {
    return;
  }

  try {
    let reply = '';

    if (chat.type === 'private') {
      reply = 'Setup a notification for yourself';
    } else {
      const admins = await ctx.getChatAdministrators();
      const isAdmin = admins.some((admin) => admin.user.id === ctx.callbackQuery.from.id);

      if (isAdmin) {
        reply = `Setup a notification for *${chat.title}*`;
      } else {
        reply = `You are not the admin for *${chat.title}*. But can setup a notification for yourself by tapping "Setup" below.`;
      }
    }

    ctx.telegram.sendMessage(ctx.callbackQuery.from.id, reply, {
      parse_mode: 'Markdown',
      reply_markup: Markup.inlineKeyboard([
        Markup.button.webApp('Setup', `${AppConfig.WebAppUrl}&chatId=${chat.id}`),
      ]).reply_markup,
    });
  } catch (err) {
    console.log(err);
  }
});

bot.telegram.setMyCommands([{ command: 'start', description: 'Instructions on getting started' }]);

bot.launch();
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

console.log('DeFi Notifications Bot is running!');
