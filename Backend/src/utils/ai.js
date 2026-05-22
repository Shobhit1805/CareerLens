const dotenv = require("dotenv");
dotenv.config();

const Groq = require("groq-sdk");

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const analyzeResumeAndJD = async (resumeText, jobDescription) => {
  const completion = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "user",
        content: `
          You are a world-class career coach, ATS specialist, and technical interviewer with 20+ years of experience.
          
          Perform a deep, thorough analysis of the resume against the job description.
          Be specific, detailed and actionable in every field.
          
          Return ONLY a JSON object with exactly this structure. No markdown, no backticks, no explanation:

          {
            "matchScore": <number between 0-100 representing how well the resume matches the JD>,
            
            "matchSummary": "<2-3 sentence summary of overall fit>",
            
            "skillGaps": [
              {
                "skill": "<specific skill name>",
                "importance": "high | medium | low",
                "description": "<exactly why this skill is needed and how it will be used in the role>",
                "howToLearn": "<specific resource or action to learn this skill>"
              }
            ],
            
            "technicalQuestions": [
              {
                "question": "<detailed technical question>",
                "difficulty": "easy | medium | hard",
                "topic": "<specific topic>",
                "whyAsked": "<why an interviewer would ask this>"
              }
            ],
            
            "behavioralQuestions": [
              {
                "question": "<detailed behavioral question>",
                "category": "leadership | teamwork | conflict | growth | other",
                "tip": "<specific tip on how to answer this question>"
              }
            ],
            
            "thirtyDayRoadmap": [
              {
                "week": "<Week 1 | Week 2 | Week 3 | Week 4>",
                "focus": "<main focus area>",
                "tasks": ["<specific task 1>", "<specific task 2>", "<specific task 3>"]
              }
            ],
            
            "strengths": [
              {
                "area": "<strength area>",
                "description": "<why this is a strength for this specific role>"
              }
            ],
            
            "atsResume": {
              "name": "<candidate full name>",
              "email": "<candidate email>",
              "phone": "<candidate phone>",
              "location": "<candidate location if available>",
              "linkedin": "<linkedin url if available>",
              "github": "<github url if available>",
              "summary": "<3-4 sentence ATS optimized professional summary tailored to the JD, use keywords from JD>",
              "skills": ["<skill1>", "<skill2>"],
              "experience": [
                {
                  "title": "<exact job title>",
                  "company": "<company name>",
                  "duration": "<start date - end date>",
                  "location": "<city, country>",
                  "points": [
                    "<achievement with specific metric e.g. Increased performance by 40%>",
                    "<achievement with specific metric>",
                    "<achievement with specific metric>",
                    "<achievement with specific metric>"
                  ]
                }
              ],
              "education": [
                {
                  "degree": "<full degree name>",
                  "institution": "<institution name>",
                  "year": "<graduation year>",
                  "gpa": "<gpa if available>",
                  "coursework": ["<relevant course 1>", "<relevant course 2>"]
                }
              ],
              "projects": [
                {
                  "name": "<project name>",
                  "description": "<2-3 sentence impactful description mentioning tech stack and outcomes>",
                  "tech": ["<tech1>", "<tech2>"],
                  "link": "<github or live link if available>"
                }
              ],
              "certifications": ["<certification 1 if any>"]
            }
          }

          STRICT REQUIREMENTS:
          - skillGaps: minimum 8, maximum 12
          - technicalQuestions: minimum 15, maximum 20
          - behavioralQuestions: minimum 8, maximum 12
          - thirtyDayRoadmap: exactly 4 weeks
          - strengths: minimum 4, maximum 6
          - experience points: minimum 4 bullet points per role, achievement-focused with metrics
          - projects: minimum 3, detailed descriptions
          - skills: minimum 15 skills

          RESUME:
          ${resumeText}

          JOB DESCRIPTION:
          ${jobDescription}

          Return only the JSON object. No markdown, no backticks, no explanation whatsoever.
        `,
      },
    ],
    temperature: 0.7,
    max_completion_tokens: 8000,
  });

  const response = completion.choices[0].message.content;

  const cleanedResponse = response
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .replace(/[\x00-\x1F\x7F]/g, " ")
    .trim();

  return JSON.parse(cleanedResponse);
};

const conductInterview = async (question, answer, topic, difficulty, context) => {
  const completion = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "user",
        content: `
          You are a strict but fair technical interviewer at a top tech company.
          
          Evaluate the following interview answer and return ONLY a JSON object:

          {
            "score": <number 0-10>,
            "verdict": "excellent | good | average | poor",
            "whatWasGood": "<specific things done well in the answer>",
            "whatWasMissing": "<specific important points that were missing>",
            "modelAnswer": "<a concise model answer for this question>",
            "improvementTip": "<one specific actionable tip to improve>"
          }

          CONTEXT:
          Topic: ${topic}
          Difficulty: ${difficulty}
          
          CANDIDATE BACKGROUND:
          ${context}

          QUESTION:
          ${question}

          CANDIDATE ANSWER:
          ${answer}

          Return only the JSON object. No markdown, no backticks, no explanation.
        `,
      },
    ],
    temperature: 0.5,
    max_completion_tokens: 1000,
  });

  const response = completion.choices[0].message.content;

  const cleanedResponse = response
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .replace(/[\x00-\x1F\x7F]/g, " ")
    .trim();

  return JSON.parse(cleanedResponse);
};

const chatWithAI = async (messages, context) => {
  const systemMessage = {
    role: "system",
    content: `
      You are CareerLens AI, a world-class career coach and technical mentor.
      You have full context of the candidate's profile:
      
      ${context}
      
      Be specific, helpful, and encouraging. Give actionable advice.
      Keep responses concise but thorough. Use bullet points when listing things.
    `,
  };

  const completion = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [systemMessage, ...messages],
    temperature: 0.7,
    max_completion_tokens: 1000,
  });

  return completion.choices[0].message.content;
};

module.exports = { analyzeResumeAndJD, conductInterview, chatWithAI };