const fs = require('fs');
const path = require('path');

/**
 * Extract text from PDF or DOCX files
 */
const extractTextFromFile = async (filePath, mimetype) => {
  if (mimetype === 'application/pdf') {
    // pdf-parse requires a buffer
    const pdfParse = require('pdf-parse');
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    return data.text;
  } else if (
    mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    const mammoth = require('mammoth');
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  }
  throw new Error('Unsupported file type');
};

/**
 * Clean up uploaded file after processing
 */
const cleanupFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (err) {
    console.error('Failed to cleanup file:', err.message);
  }
};

module.exports = { extractTextFromFile, cleanupFile };
