require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const { generateImage } = require("./horde");
const styles = require("./styles");
const state = require("./state");

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });
const OWNER_ID = process.env.OWNER_ID;

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  if (chatId.toString() !== OWNER_ID) return;

  const user = state.get(chatId);
  const [cmd, ...rest] = msg.text.split(" ");

  if (cmd === "/styles") {
    let text = "Styles:\n";
    for (const k in styles) text += `/${k}\n`;
    return bot.sendMessage(chatId, text);
  }

  if (cmd === "/size") {
    user.size = rest[0];
    return bot.sendMessage(chatId, "Size set");
  }

  if (cmd === "/negative") {
    user.negative = rest.join(" ");
    return bot.sendMessage(chatId, "Negative saved");
  }

  if (cmd === "/seed") {
    user.seed = parseInt(rest[0]);
    return bot.sendMessage(chatId, "Seed saved");
  }

  const style = cmd.replace("/", "");
  if (!styles[style]) return;

  const prompt = styles[style].prompt + ", " + rest.join(" ");
  const img = await generateImage(prompt, styles[style].models, user);
  bot.sendPhoto(chatId, img);
});
