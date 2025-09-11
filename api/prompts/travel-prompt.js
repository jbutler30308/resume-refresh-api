import { system, createVerificationPrompt } from '../templates/travel-templates.js'

const completePrompt = ({ groupSize, destination, dates, groupDetails, budgetBand = 'mid' }) => {
  // Expect dates as [start, end], strings
  const formattedDates = dates.join(' to ')

  const prompt = `You are a travel coordinator creating a curated travel program for a small group trip.

Group details:
- groupSize: ${groupSize}
- destination: ${destination}
- dates: ${formattedDates}  (format: YYYY-MM-DD to YYYY-MM-DD)
- travelerProfile: ${groupDetails}

Instructions:
- Provide a collection of activities, sights, cultural experiences, food options, day trips, and special events available during these dates.
- Do NOT create an hour-by-hour or strict day-by-day schedule; instead provide flexible options that can be mixed-and-matched.
- Balance cultural highlights, markets, food, history, outdoor activities, local traditions, and at least one well-known highlight plus off-the-beaten-path suggestions.
- Note if any activity is weekday/weekend/holiday-specific and mark closure risks (public holidays).
- Include contact information (phone number in E.164 and local format, email, website), pricing (per-person or per-group), and a source_url for each item when possible.
- For each item found online, include a "price_extraction_note" string explaining how price was obtained (e.g., "from official website pricing table", "estimated from OTA average", "vendor responded via contact form") and a "confidence" float (0-1).
- Use local currency and, when helpful, provide an approximate USD conversion and the conversion date.
- Organize suggestions under categories: accommodations, weather, Cultural & Historical Highlights, Local Food & Dining, Markets & Shopping, Outdoor Adventures & Nature, Day Trips / Excursions, Evening & Nightlife Experiences, Seasonal or Special Events.
- Output FORMAT: produce JSON that matches the schema, a human summary with bullets as in "report" property, and all phone/email contact cards ready to import into contacts.
`;

  return { system, user: prompt, verification: createVerificationPrompt({ groupSize, destination, dates, groupDetails })}
}

export default completePrompt;