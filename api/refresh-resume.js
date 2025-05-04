const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle OPTIONS request (preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed", message: "Only POST requests are supported" });
  }

  console.log("Request received:", req.method, req.url);
  console.log("Request body:", req.body);

  try {
    const { jobTitle, industry, resumeText } = req.body;

    if (!jobTitle || !industry || !resumeText) {
      return res.status(400).json({ 
        error: "Missing required fields",
        received: req.body,
        requiredFields: ["jobTitle", "industry", "resumeText"]
      });
    }

    const prompt = `
You are a professional resume writer. Rewrite the resume below for a role as a ${jobTitle} in the ${industry} industry. Use modern, ATS-friendly formatting and results-oriented language. Improve clarity, impact, and relevance.

Resume:
${resumeText}
`;

    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const updatedResume = completion.data.choices[0].message.content;
    res.status(200).json({ updatedResume });
  } catch (error) {
    console.error("Error details:");
    if (error.response) {
      console.error("OpenAI API error:", error.response.status, error.response.data);
    } else {
      console.error(error);
    }
    res.status(500).json({ 
      error: "Error processing request.", 
      message: error.message,
      hint: "Check server logs for more details"
    });
  }
};
