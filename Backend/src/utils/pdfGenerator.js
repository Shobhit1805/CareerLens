const puppeteer = require("puppeteer");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");

const generateResumePDF = async (atsResume) => {
  // Read the template file
  const templatePath = path.join(__dirname, "resumeTemplate.hbs");
  const templateSource = fs.readFileSync(templatePath, "utf8");

  // Compile template with Handlebars and inject data
  const template = handlebars.compile(templateSource);
  const html = template(atsResume);

  // Launch Puppeteer and render to PDF
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  await page.setContent(html, { waitUntil: "networkidle0" });

  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: {
      top: "20px",
      bottom: "20px",
      left: "20px",
      right: "20px",
    },
  });

  await browser.close();

  return pdfBuffer;
};

module.exports = { generateResumePDF };