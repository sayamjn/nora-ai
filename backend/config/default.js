module.exports = {
  port: process.env.PORT || 5000,
  env: process.env.NODE_ENV || 'development',
  
  mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/nora-ai',
  
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  jwtExpiration: '24h',
  
  claudeApiKey: process.env.CLAUDE_API_KEY,
  claudeApiUrl: 'https://api.anthropic.com/v1/messages',
  claudeModel: process.env.CLAUDE_MODEL || 'claude-3-sonnet-20240229',
  
  uploadDir: 'uploads/',
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedFileTypes: ['.pdf', '.docx'],
  
  defaultQuestionCount: 5,
  maxInterviewDuration: 30 * 60 * 1000, // 30 minutes
};