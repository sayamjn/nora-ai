const axios = require('axios');
const config = require('../config/default');
const logger = require('../utils/logger');


class AIService {
  constructor() {
    this.apiKey = process.env.CLAUDE_API_KEY;
    this.apiUrl = config.claudeApiUrl;
    this.model = config.claudeModel;
    if (!this.apiKey) {
      logger.error('Claude API key is not set');
    }
    
    this.axiosInstance = axios.create({
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01'
      }
    });
  }

  /**
   * Generate a system prompt based on resume and job description
   * @param {string} resumeText - The parsed resume text
   * @param {string} jobDescription - The job description
   * @returns {string} - System prompt for Claude
   */
  generateSystemPrompt(resumeText, jobDescription) {
    return `You are an expert interviewer for a job position. 
    
Here is the candidate's resume:
"""
${resumeText}
"""

Here is the job description:
"""
${jobDescription}
"""

Your task is to conduct a professional job interview to assess the candidate's fit for this position. 
Ask thoughtful, relevant questions based on the candidate's experience and the job requirements.
Questions should be challenging but fair, focusing on skills, experience, and behavioral aspects.
Avoid basic or generic questions. Tailor each question to the specific details in the resume and job description.
Be conversational but professional in your tone.`;
  }
  
  /**
   * Generate feedback system prompt
   * @param {Object} interview - The interview object
   * @param {Array} transcript - The interview transcript
   * @returns {string} - System prompt for feedback generation
   */
  generateFeedbackSystemPrompt(interview, transcript) {
    const messagesText = transcript.messages
      .map(msg => `${msg.role.toUpperCase()}: ${msg.content}`)
      .join('\n\n');
    
    return `You are an expert hiring manager evaluating a job candidate.

Here is the candidate's resume:
"""
${interview.resumeText}
"""

Here is the job description:
"""
${interview.jobDescription}
"""

Here is the interview transcript:
"""
${messagesText}
"""

Provide a comprehensive evaluation of the candidate based on the interview transcript, resume, and job description.
Your feedback should include:
1. Overall assessment (2-3 paragraphs)
2. Top 3-5 strengths
3. Top 2-3 areas for improvement
4. Specific skill assessments (rating 1-5) for relevant skills
5. Job fit score (0-100)
6. Recommended next steps or development areas

Be fair, balanced, and constructive in your feedback.`;
  }

  /**
   * Generate next interview question based on context
   * @param {Object} interview - The interview object
   * @param {Array} previousMessages - Previous messages in the conversation
   * @returns {Promise<string>} - The next question
   */
  async generateNextQuestion(interview, previousMessages) {
    try {
      const systemPrompt = this.generateSystemPrompt(interview.resumeText, interview.jobDescription);
      
      let messages = [
        { role: 'system', content: systemPrompt }
      ];
      
      // Add previous messages
      for (const msg of previousMessages) {
        if (msg.role !== 'system') {
          messages.push({
            role: msg.role,
            content: msg.content
          });
        }
      }
      
      // Add the final prompt
      if (previousMessages.length === 0) {
        messages.push({
          role: 'user', 
          content: 'Please start the interview with an appropriate introduction and your first question.'
        });
      } else {
        messages.push({
          role: 'user',
          content: 'Based on this answer, please ask your next relevant interview question.'
        });
      }
      
      console.log('Sending request to Claude API:', {
        model: this.model,
        messages: messages.length,
        max_tokens: 1000
      });
      
      // Log the API key (first 10 chars only for security)
      if (this.apiKey) {
        console.log('Using API key starting with:', this.apiKey.substring(0, 10) + '...');
      }
      
      const response = await this.axiosInstance.post(this.apiUrl, {
        model: this.model,
        messages: messages,
        max_tokens: 1000,
        temperature: 0.7
      });
      
      if (response.data && response.data.content && response.data.content.length > 0) {
        return response.data.content[0].text;
      } else {
        logger.error('Unexpected response format from Claude API:', JSON.stringify(response.data));
        throw new Error('Unexpected response format from Claude API');
      }
    } catch (error) {
      console.log('Claude API error details:', error.response?.data || error.message);
      logger.error(`Error generating interview question: ${error.message}`);
      throw new Error('Failed to generate interview question');
    }
  }
  
  /**
   * Generate feedback for completed interview
   * @param {Object} interview - The interview object with resume and job description
   * @param {Object} transcript - The interview transcript
   * @returns {Promise<Object>} - Structured feedback
   */
  async generateFeedback(interview, transcript) {
    try {
      const systemPrompt = this.generateFeedbackSystemPrompt(interview, transcript);
      
      const response = await this.axiosInstance.post(this.apiUrl, {
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: 'Please provide comprehensive feedback on this candidate.' }
        ],
        max_tokens: 2500,
        temperature: 0.5
      });
      
      const feedbackText = response.data.content[0].text;
      
      return this.parseFeedback(feedbackText);
    } catch (error) {
      logger.error(`Error generating feedback: ${error.message}`);
      throw new Error('Failed to generate interview feedback');
    }
  }
  
  /**
   * Parse the feedback text into structured format
   * @param {string} feedbackText - Raw feedback text from Claude
   * @returns {Object} - Structured feedback object
   */
  parseFeedback(feedbackText) {
    try {
      const sections = feedbackText.split(/\n\d+\.\s+/).filter(s => s.trim().length > 0);
      
      const overallAssessment = sections[0].trim();
      
      const strengthsSection = feedbackText.match(/[Ss]trengths?:(.*?)(?=[Ww]eaknesses?:|[Aa]reas? for improvement:|$)/s);
      const strengths = strengthsSection 
        ? strengthsSection[1].split(/[-•*]\s+/).filter(s => s.trim().length > 0).map(s => s.trim())
        : [];
      
      const weaknessesSection = feedbackText.match(/(?:[Ww]eaknesses?|[Aa]reas? for improvement):(.*?)(?=[Ss]kill [Aa]ssessments?:|[Jj]ob [Ff]it|[Rr]ecommend|$)/s);
      const weaknesses = weaknessesSection
        ? weaknessesSection[1].split(/[-•*]\s+/).filter(s => s.trim().length > 0).map(s => s.trim())
        : [];
      
      const skillsSection = feedbackText.match(/[Ss]kill [Aa]ssessments?:(.*?)(?=[Jj]ob [Ff]it|[Rr]ecommend|$)/s);
      const skillAssessments = [];
      
      if (skillsSection) {
        const skillLines = skillsSection[1].split('\n').filter(line => line.match(/[1-5]\s*\/\s*5|[1-5]\.0/));
        
        skillLines.forEach(line => {
          const match = line.match(/(.*?)(?::|-)?\s*([1-5](?:\.[0-9])?)\s*(?:\/\s*5)?/);
          if (match) {
            skillAssessments.push({
              skill: match[1].trim(),
              rating: parseInt(match[2]),
              comments: ''
            });
          }
        });
      }
      
      const fitScoreMatch = feedbackText.match(/[Jj]ob [Ff]it(?:\s+[Ss]core)?(?::|\s+is|\s+-)\s*([0-9]{1,3})/);
      const fitScore = fitScoreMatch ? parseInt(fitScoreMatch[1]) : 70; // Default if not found
      
      const recommendationsSection = feedbackText.match(/[Rr]ecommend(?:ations?|ed next steps):(.*?)$/s);
      const recommendations = recommendationsSection
        ? recommendationsSection[1].split(/[-•*]\s+/).filter(s => s.trim().length > 0).map(s => s.trim())
        : [];
      
      return {
        overallAssessment,
        strengthsAndWeaknesses: {
          strengths,
          weaknesses
        },
        skillAssessments,
        fitScore,
        recommendations
      };
    } catch (error) {
      logger.error(`Error parsing feedback: ${error.message}`);
      return {
        overallAssessment: feedbackText.substring(0, 500),
        strengthsAndWeaknesses: {
          strengths: [],
          weaknesses: []
        },
        skillAssessments: [],
        fitScore: 70,
        recommendations: []
      };
    }
  }
}

module.exports = new AIService();