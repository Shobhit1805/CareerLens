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
          You are an expert career coach and ATS specialist.
          Analyze the following resume and job description carefully.
          Return a JSON object with exactly this structure and nothing else:

          {
            "skillGaps": [
              {
                "skill": "skill name",
                "importance": "high | medium | low",
                "description": "why this skill is needed for the role"
              }
            ],
            "technicalQuestions": [
              {
                "question": "question text",
                "difficulty": "easy | medium | hard",
                "topic": "topic name"
              }
            ],
            "behavioralQuestions": [
              {
                "question": "question text",
                "category": "leadership | teamwork | conflict | growth | other"
              }
            ],
            "atsResume": {
              "name": "candidate full name",
              "email": "candidate email",
              "phone": "candidate phone",
              "summary": "ATS optimized professional summary",
              "skills": ["skill1", "skill2"],
              "experience": [
                {
                  "title": "job title",
                  "company": "company name",
                  "duration": "start - end",
                  "points": ["achievement 1", "achievement 2"]
                }
              ],
              "education": [
                {
                  "degree": "degree name",
                  "institution": "institution name",
                  "year": "graduation year"
                }
              ],
              "projects": [
                {
                  "name": "project name",
                  "description": "project description",
                  "tech": ["tech1", "tech2"]
                }
              ]
            }
          }

          RESUME:
          ${resumeText}

          JOB DESCRIPTION:
          ${jobDescription}

          Return only the JSON object. No markdown, no backticks, no explanation.
        `,
      },
    ],
    temperature: 1,
    max_completion_tokens: 4096,
  });

  const response = completion.choices[0].message.content;

  const cleanedResponse = response
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  return JSON.parse(cleanedResponse);
};

module.exports = { analyzeResumeAndJD };