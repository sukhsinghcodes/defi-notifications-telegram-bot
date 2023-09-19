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

    ctx.telegram.sendMessage(
      ctx.from.id,
      'Get free mobile notifications for important on-chain events in your favorite DeFi projects.\n\nJoin [our channel](https://t.me/defi_notifications) to receive updates and promotions.',
      {
        parse_mode: 'Markdown',
        reply_markup: Markup.inlineKeyboard([
          [
            Markup.button.url('💬 Support', 'https://t.me/defi_notifications'),
            Markup.button.url('🌎 Website', 'https://www.orbs.com/notifications/'),
          ],
          [Markup.button.webApp('📤 Open app', `${AppConfig.WebAppUrl}&chatId=${ctx.chat.id}`)],
        ]).reply_markup,
      },
    );
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
        Markup.button.webApp('Next ➡️', `${AppConfig.WebAppUrl}&chatId=${chat.id}`),
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
