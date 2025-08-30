import { system, verification } from '../templates/travel-templates.js'

const completePrompt = ({ groupSize, destination, dates }) => {
  // Expect dates as [start, end], strings
  const formattedDates = dates.join(' to ')

  const prompt = `You are a travel coordinator creating a curated travel program for a small group trip.

Group details: ${groupSize}  
Destination: ${destination}  
Dates: ${formattedDates}  

Instructions:  
- Provide a collection of activities, sights, cultural experiences, food options, day trips, and special events available during this time.  
- Do NOT create an hour-by-hour or strict day-by-day schedule. Instead, suggest flexible options that can be mixed and matched.  
- Balance cultural highlights, local markets, food experiences, historical sites, outdoor activities, and authentic local traditions. Include experiences that work well for groups.  
- Organize suggestions by theme or category, such as:  
  • Cultural & Historical Highlights  
  • Local Food & Dining  
  • Markets & Shopping  
  • Outdoor Adventures & Nature  
  • Day Trips / Excursions  
  • Evening & Nightlife Experiences  
  • Seasonal or Special Events  
- Assume travelers have varied interests and moderate fitness. Provide a mix of lighter and more active options.  
- Note if certain activities are better suited to weekends, weekdays, or specific dates.  
- Recommend group-friendly dining, cafés, or entertainment when relevant.  
`;

  return { system, user: prompt, verification: verification({ groupSize, destination, dates })}
}

export default completePrompt;