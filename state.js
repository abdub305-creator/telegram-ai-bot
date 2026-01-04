const state = {};

function get(chatId) {
  if (!state[chatId]) {
    state[chatId] = {
      size: "portrait",
      negative: "",
      seed: null
    };
  }
  return state[chatId];
}

module.exports = { get };
