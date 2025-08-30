import OpenAI from 'openai'
import buildPrompt from './prompts/travel-prompt.js'

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
    const { destination, dates, groupSize } = req.body

    console.log('Received fields:', {
      destination: !!destination,
      dates: !!dates,
      groupSize: !!groupSize
    })

    if (!destination || !dates || !groupSize) {
      return res.status(400).json({
        error: 'Missing required fields',
        received: req.body,
        requiredFields: ['destination', 'dates', 'groupSize']
      })
    }

    const prompt = buildPrompt({ destination, dates, groupSize })

    const completion = await client.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: prompt.system },
        { role: 'user', content: prompt.user }
      ],
      temperature: 0.7
    })

    const travelPlan = completion.choices[0].message.content

    // Rebuild the prompt for verification
    // Assumes buildPrompt returns { system, user, verification }
    const verificationPrompt = prompt.verification(travelPlan)
    const verificationCompletion = await client.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: prompt.system },
        { role: 'user', content: verificationPrompt }
      ],
      temperature: 0.3
    })
    const verificationResult = verificationCompletion.choices[0].message.content

    res.status(200).json({ travelPlan, verification: verificationResult })
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
