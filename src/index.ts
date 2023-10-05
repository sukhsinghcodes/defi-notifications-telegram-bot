import { Telegraf, Context, Markup } from 'telegraf';
import { Update } from 'telegraf/typings/core/types/typegram';
import { AppConfig } from './config';

const bot = new Telegraf<Context<Update>>(AppConfig.ApiToken);

bot.start(async (ctx) => {
  try {
    if (ctx.chat.type !== 'private') {
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
            Markup.button.url('🌎 Website', 'https://www.orbs.com/notifications'),
          ],
          [
            Markup.button.webApp(
              '🔔 Setup notification',
              `${AppConfig.WebAppUrl}&telegramId=${ctx.chat.id}`,
            ),
          ],
        ]).reply_markup,
      },
    );

    bot.telegram.setChatMenuButton({
      chatId: ctx.chat.id,
      menuButton: {
        web_app: { url: `${AppConfig.WebAppUrl}&telegramId=${ctx.chat.id}` },
        text: '🔔 Notification',
        type: 'web_app',
      },
    });
  } catch (err) {
    console.log('An error occured when executing the start command', err);
  }
});

bot.telegram.setMyCommands([{ command: 'start', description: 'Instructions on getting started' }]);

bot.launch();
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

console.log('DeFi Notifications Bot is running!');
