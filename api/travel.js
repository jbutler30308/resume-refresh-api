
import OpenAI from 'openai'
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";
import { marked } from 'marked'
import buildPrompt from './prompts/travel-prompt.js'
import { parseResponse } from './travelService/service.js'
import logger from './lib/logger.js';
import schema from './templates/travel-schema.json' with { type: 'json' };

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export default async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST')
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
    // Support revision: if conversation array is present, use it for OpenAI chat
    const { conversation, destination, dates, groupSize, groupDetails } = req.body;

    if (Array.isArray(conversation) && conversation.length >= 2) {
      // Revision or chat-based request
      // Validate roles/content minimally
      const validRoles = ['system', 'user', 'assistant'];
      if (!conversation.every(msg => msg && validRoles.includes(msg.role) && typeof msg.content === 'string')) {
        return res.status(400).json({ error: 'Invalid conversation format' });
      }
      // Use the first system message as instructions, blend the rest into a single user prompt
      const systemMsg = conversation.find(msg => msg.role === 'system')?.content || '';
      // All user/assistant messages after the first system message
      const blended = conversation
        .filter((msg, idx) => idx > 0)
        .map(msg => `[${msg.role.toUpperCase()}]: ${msg.content}`)
        .join('\n');
      // Compose OpenAI call using client.responses.create
      const completion = await client.responses.create({
        model: 'gpt-4o',
        instructions: systemMsg,
        input: blended,
        tools: [
          { type: 'web_search' }
        ],
        temperature: 0.7,
        text: {
          format: {
            "name": "itinerary",
            "type": "json_schema",
            "strict": true,
            "schema": schema,
          }
        }
      });
      const travelPlan = completion.output_text;
      // Verification step (optional, can use last user/system prompt)
      const verificationPrompt = `Verify the following itinerary for feasibility and completeness.\n\n${travelPlan}`;
      const verificationCompletion = await client.responses.create({
        model: 'gpt-4o',
        instructions: 'You are a travel expert. Review and verify the following itinerary.',
        input: verificationPrompt,
        tools: [
          { type: 'web_search' }
        ],
        temperature: 0.3
      });
      const verificationResult = verificationCompletion.output_text;
      logger.info('travelPlan: %j', travelPlan);
      let planHtml = '';
      try {
        planHtml = parseResponse(JSON.parse(travelPlan));
      } catch (e) {
        planHtml = travelPlan;
      }
      logger.info('planHtml: %j', planHtml);
      logger.info('verificationResult: %j', verificationResult);
      const verificationHtml = marked.parse(verificationResult).replace(/\n/g, '');
      res.status(200).json({ travelPlan: planHtml, verification: verificationHtml, rawPlan: travelPlan, rawVerification: verificationResult });
      return;
    }

    // Fallback: legacy (initial) request
    console.log('Received fields:', {
      destination: !!destination,
      dates: !!dates,
      groupSize: !!groupSize,
      groupDetails: !!groupDetails
    })

    if (!destination || !dates || !groupSize) {
      return res.status(400).json({
        error: 'Missing required fields',
        received: req.body,
        requiredFields: ['destination', 'dates', 'groupSize']
      })
    }

    const prompt = buildPrompt({ destination, dates, groupSize, groupDetails })

    const completion = await client.responses.create({
      model: 'gpt-4o',
      instructions: prompt.system,
      input: prompt.user,
      tools: [
        {
          type: 'web_search'
        }
      ],
      temperature: 0.7,
      text: {
        format: {
          "name": "itinerary",
          "type": "json_schema",
          "strict": true,
          "schema": schema,
        }
      }
    })

    const travelPlan = completion.output_text

    const verificationPrompt = prompt.verification(travelPlan)
    const verificationCompletion = await client.responses.create({
      model: 'gpt-4o',
      instructions: prompt.system,
      input: verificationPrompt,
      tools: [
        {
          type: 'web_search'
        }
      ],
      temperature: 0.3
    })
    const verificationResult = verificationCompletion.output_text
    logger.info('travelPlan: %j', travelPlan);
    const planHtml = parseResponse(JSON.parse(travelPlan));
    logger.info('planHtml: %j', planHtml);
    logger.info('verificationResult: %j', verificationResult);
    const verificationHtml = marked.parse(verificationResult).replace(/\n/g, '')
    res.status(200).json({ travelPlan: planHtml, verification: verificationHtml, rawPlan: travelPlan, rawVerification: verificationResult })
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
