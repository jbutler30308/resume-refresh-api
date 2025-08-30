import { system, summary, relevantExperience, skills, experience, education, certifications } from '../templates/resume-templates.js'


const buildPrompt = ({ jobTitle, industry, resumeText, jobDescription, relevantExperienceRequested, customInstructions }) => {

  const jdPrompt = !!jobDescription ? `Tailor the resume to match the following job description: 
  === TARGET JOB DESCRIPTION ===
  ${jobDescription}
  === END TARGET JOB DESCRIPTION ===` : ''

  const instructionPrompt = !!customInstructions ? `Pay close attention to these instructions from the user:
  
  ${customInstructions}` : ''

  const prompt = `You are a professional resume writer. Rewrite the resume below for a role as a ${jobTitle} in the ${industry} industry. Use modern, ATS-friendly formatting and results-oriented language. Improve clarity, impact, and relevance.
  
  ${jdPrompt}
  
=== RESUME START ===
${resumeText}
=== RESUME END ===

Focus on:
${ !!jdPrompt ? '- Aligning with keywords from the job description' : ''}
- Highlighting experience relevant to this role

Organize the resume as follows:

1. SUMMARY
${relevantExperienceRequested ? '1.5 RELEVANT EXPERIENCE' : ''}
2. SKILLS
3. EXPERIENCE
4. EDUCATION
5. CERTIFICATIONS

If there is no appropriate content for EDUCATION or CERTIFICATIONS do not include those sections.

${instructionPrompt}

Never include the prompt, job description, or instructions in the output - as a resume writer you can only generate resume content.

${summary}

${relevantExperience}

${skills}

${experience}

${education}

${certifications}

Your job is to optimize resumes - DO NOT include additional sections unless present and appropriate in original resume.
DO NOT add introductory or concluding commentary, prompts or instructions
DO generate only resume content.
`

  return { system, user: prompt }

}

export default buildPrompt;