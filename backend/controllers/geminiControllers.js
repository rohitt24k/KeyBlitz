exports.startConv = async (req, res) => {
  const { GoogleGenerativeAI } = require("@google/generative-ai");

  // Access your API key as an environment variable (see "Set up your API key" above)
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  async function run() {
    // For text-only input, use the gemini-pro model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: "Hello, I have 2 dogs in my house.",
        },
        {
          role: "model",
          parts: "i don't care.",
        },
      ],
      generationConfig: {
        maxOutputTokens: 100,
      },
    });

    const msg = "How many paws are in my house?";

    const result = await chat.sendMessage(msg);
    const response = await result.response;
    const text = response.text();
    console.log(text);
    const chatHistory = await chat.getHistory();
    res.json(chatHistory);
  }

  run();
  //   res.send("fuckks");
};
