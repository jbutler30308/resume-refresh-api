import { system, summary, skills, experience, education, certifications } from './templates.js'


const buildPrompt = ({ jobTitle, industry, resumeText, jobDescription, relevantExperience, customInstructions }) => {

  const jdPrompt = !!jobDescription ? `Tailor the resume to match the following job description: 
  === TARGET JOB DESCRIPTION ===
  ${jobDescription}
  === END TARGET JOB DESCRIPTION ===` : ''

  const rePrompt = !!relevantExperience ? `Integrate references this relevant experience: 
  === RELEVANT EXPERIENCE ===
  ${relevantExperience}
  === END RELEVANT EXPERIENCE ===` : ''

  const instructionPrompt = !!customInstructions ? `Pay close attention to these additions from the user:
  
  ${customInstructions}` : ''

  const prompt = `You are a professional resume writer. Rewrite the resume below for a role as a ${jobTitle} in the ${industry} industry. Use modern, ATS-friendly formatting and results-oriented language. Improve clarity, impact, and relevance.
  
  ${jdPrompt}
  
  ${rePrompt}

=== RESUME START ===
${resumeText}
=== RESUME END ===

Focus on:
${ !!jdPrompt ? '- Aligning with keywords from the job description' : ''}
- Highlighting experience relevant to this role

Organize the resume as follows:

1. SUMMARY
2. SKILLS
3. EXPERIENCE
4. EDUCATION
5. CERTIFICATIONS

If there is no appropriate content for EDUCATION or CERTIFICATIONS do not include those sections.

${instructionPrompt}

Do not add introductory or concluding commentary - return only the resume.

${summary}

${skills}

${experience}

${education}

${certifications}
`

  return { system, user: prompt }

}

export default buildPrompt;