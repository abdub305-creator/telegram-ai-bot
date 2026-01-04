const axios = require("axios");

const sizes = {
  square: [512, 512],
  portrait: [512, 768],
  hd: [768, 1024]
};

async function generateImage(prompt, models, options) {
  const [width, height] = sizes[options.size];

  const submit = await axios.post(
    "https://api.ai-horde.dev/v1/generate",
    {
      prompt,
      negative_prompt: options.negative,
      params: {
        width,
        height,
        seed: options.seed || undefined
      },
      models
    }
  );

  const id = submit.data.id;

  while (true) {
    await new Promise(r => setTimeout(r, 3000));
    const status = await axios.get(
      `https://api.ai-horde.dev/v1/generate/status/${id}`
    );
    if (status.data.done) {
      return status.data.generations[0].img;
    }
  }
}

module.exports = { generateImage };
