const pdfParse = require("pdf-parse");
const { analyzeResumeAndJD, conductInterview, chatWithAI } = require("../utils/ai");
const { generateResumePDF } = require("../utils/pdfGenerator");

const analyzeResume = async (req, res) => {
  try {
    const { jobDescription } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Please upload a resume PDF" });
    }

    if (!jobDescription) {
      return res.status(400).json({ message: "Please provide a job description" });
    }

    const pdfData = await pdfParse(req.file.buffer);
    const resumeText = pdfData.text;

    if (!resumeText || resumeText.trim().length === 0) {
      return res.status(400).json({ message: "Could not extract text from PDF" });
    }

    const analysisResult = await analyzeResumeAndJD(resumeText, jobDescription);

    // Store resume text and JD in result for chat context later
    analysisResult.resumeText = resumeText;
    analysisResult.jobDescription = jobDescription;

    res.status(200).json({
      message: "Analysis complete",
      data: analysisResult,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const downloadResume = async (req, res) => {
  try {
    const { atsResume } = req.body;

    if (!atsResume) {
      return res.status(400).json({ message: "No resume data provided" });
    }

    const pdfBuffer = await generateResumePDF(atsResume);

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${atsResume.name}_resume.pdf"`,
      "Content-Length": pdfBuffer.length,
    });

    res.status(200).end(pdfBuffer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const interviewAnswer = async (req, res) => {
  try {
    const { question, answer, topic, difficulty, resumeText, jobDescription } = req.body;

    if (!question || !answer) {
      return res.status(400).json({ message: "Question and answer are required" });
    }

    const context = `
      Resume Summary: ${resumeText || "Not provided"}
      Job Description: ${jobDescription || "Not provided"}
    `;

    const feedback = await conductInterview(question, answer, topic, difficulty, context);

    res.status(200).json({
      message: "Answer evaluated",
      feedback,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const chat = async (req, res) => {
  try {
    const { messages, resumeText, jobDescription, analysisResult } = req.body;

    if (!messages || messages.length === 0) {
      return res.status(400).json({ message: "Messages are required" });
    }

    const context = `
      RESUME:
      ${resumeText || "Not provided"}
      
      JOB DESCRIPTION:
      ${jobDescription || "Not provided"}
      
      ANALYSIS RESULTS:
      Match Score: ${analysisResult?.matchScore || "Not analyzed"}
      Match Summary: ${analysisResult?.matchSummary || "Not analyzed"}
      Skill Gaps: ${analysisResult?.skillGaps?.map(s => s.skill).join(", ") || "Not analyzed"}
      Strengths: ${analysisResult?.strengths?.map(s => s.area).join(", ") || "Not analyzed"}
    `;

    const reply = await chatWithAI(messages, context);

    res.status(200).json({
      message: "Reply generated",
      reply,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { analyzeResume, downloadResume, interviewAnswer, chat };