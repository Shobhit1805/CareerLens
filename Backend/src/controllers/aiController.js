const pdfParse = require("pdf-parse");
const { analyzeResumeAndJD } = require("../utils/gemini");
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

    // Extract text from uploaded PDF
    const pdfData = await pdfParse(req.file.buffer);
    const resumeText = pdfData.text;

    if (!resumeText || resumeText.trim().length === 0) {
      return res.status(400).json({ message: "Could not extract text from PDF" });
    }

    // Send to Gemini for analysis
    const analysisResult = await analyzeResumeAndJD(resumeText, jobDescription);

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

    // Generate PDF from atsResume data
    const pdfBuffer = await generateResumePDF(atsResume);

    // Send PDF as downloadable file
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

module.exports = { analyzeResume, downloadResume };