import OpenAI from 'openai'
import buildPrompt from './prompt.js'

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})


export default async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )

  // Handle OPTIONS request (preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed',
      message: 'Only POST requests are supported'
    })
  }

  try {
    const { jobTitle, industry, resumeText, jobDescription, relevantExperience } = req.body

    console.log('Received fields:', {
      jobTitle: !!jobTitle,
      industry: !!industry,
      resumeText: resumeText?.substring(0, 50) + '...',
      jobDescription: !!jobDescription,
      relevantExperience: !!relevantExperience
    })

    if (!jobTitle || !industry || !resumeText) {
      return res.status(400).json({
        error: 'Missing required fields',
        received: req.body,
        requiredFields: ['jobTitle', 'industry', 'resumeText']
      })
    }

    const prompt = buildPrompt(jobTitle, industry, resumeText, jobDescription, relevantExperience)

    const completion = await client.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: prompt.system },
        { role: 'user', content: prompt.user }
      ],
      temperature: 0.7
    })

    const updatedResume = completion.choices[0].message.content
    res.status(200).json({ updatedResume })
  } catch (error) {
    console.error('Error details:')
    if (error.response) {
      console.error(
        'OpenAI API error:',
        error.response.status,
        error.response.data
      )
    } else {
      console.error(error)
    }
    res.status(500).json({
      error: 'Error processing request.',
      message: error.message,
      hint: 'Check server logs for more details'
    })
  }
}
