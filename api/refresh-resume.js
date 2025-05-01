const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { jobTitle, industry, resumeText } = req.body;

  if (!jobTitle || !industry || !resumeText) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const prompt = `
You are a professional resume writer. Rewrite the resume below for a role as a ${jobTitle} in the ${industry} industry. Use modern, ATS-friendly formatting and results-oriented language. Improve clarity, impact, and relevance.

Resume:
${resumeText}
`;

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const updatedResume = completion.data.choices[0].message.content;
    res.status(200).json({ updatedResume });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Error processing request." });
  }
};
