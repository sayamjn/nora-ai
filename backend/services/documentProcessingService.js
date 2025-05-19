const fs = require('fs');
const path = require('path');
const mammoth = require('mammoth');
const pdf = require('pdf-parse');
const config = require('../config/default');
const logger = require('../utils/logger');


class DocumentProcessingService {
  /**
   * Extract text from a file
   * @param {Object} file - The uploaded file object
   * @returns {Promise<string>} - Extracted text
   */
  async extractText(file) {
    try {
      const filePath = file.path;
      const fileExtension = path.extname(file.originalname).toLowerCase();
      
      if (fileExtension === '.pdf') {
        return await this.extractTextFromPdf(filePath);
      } else if (fileExtension === '.docx') {
        return await this.extractTextFromDocx(filePath);
      } else {
        throw new Error(`Unsupported file type: ${fileExtension}`);
      }
    } catch (error) {
      logger.error(`Error extracting text from document: ${error.message}`);
      throw new Error('Failed to extract text from document');
    }
  }
  
  /**
   * Extract text from a PDF file
   * @param {string} filePath - Path to the PDF file
   * @returns {Promise<string>} - Extracted text
   */
  async extractTextFromPdf(filePath) {
    try {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdf(dataBuffer);
      return data.text;
    } catch (error) {
      logger.error(`Error extracting text from PDF: ${error.message}`);
      throw new Error('Failed to extract text from PDF');
    }
  }
  
  /**
   * Extract text from a DOCX file
   * @param {string} filePath - Path to the DOCX file
   * @returns {Promise<string>} - Extracted text
   */
  async extractTextFromDocx(filePath) {
    try {
      const result = await mammoth.extractRawText({ path: filePath });
      return result.value;
    } catch (error) {
      logger.error(`Error extracting text from DOCX: ${error.message}`);
      throw new Error('Failed to extract text from DOCX');
    }
  }
  
  /**
   * Clean up extracted text
   * @param {string} text - Raw text from document
   * @returns {string} - Cleaned text
   */
  cleanText(text) {
    let cleaned = text;
    
    cleaned = cleaned.replace(/\s+/g, ' ');
    
    cleaned = cleaned.replace(/[^\x20-\x7E\n]/g, '');
    
    cleaned = cleaned.replace(/([^\w\s])\1{3,}/g, '$1');
    
    return cleaned.trim();
  }
  
  /**
   * Process an uploaded document and return cleaned text
   * @param {Object} file - The uploaded file object
   * @returns {Promise<string>} - Processed text
   */
  async processDocument(file) {
    const extractedText = await this.extractText(file);
    return this.cleanText(extractedText);
  }
}

module.exports = new DocumentProcessingService();