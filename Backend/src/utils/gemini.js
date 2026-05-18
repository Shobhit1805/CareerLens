const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
dotenv.config();


// console.log("GEMINI KEY:", process.env.GEMINI_API_KEY);
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const analyzeResumeAndJD = async (resumeText, jobDescription) => {
//   const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `
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
  `;

  const result = await model.generateContent(prompt);
  const response = result.response.text();

  const cleanedResponse = response
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  return JSON.parse(cleanedResponse);
};

module.exports = { analyzeResumeAndJD };

