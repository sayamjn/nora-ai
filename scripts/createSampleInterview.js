// scripts/createSampleInterview.js
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../backend/models/User');
const Interview = require('../backend/models/Interview');
const fs = require('fs');
const path = require('path');

// Replace with your MongoDB URI
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/nora-ai';

async function createSampleInterview() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');

    // Find the first user or create one if none exists
    let user = await User.findOne();
    if (!user) {
      user = new User({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'user'
      });
      await user.save();
      console.log('Created test user');
    }

    // Create a sample interview
    const interview = new Interview({
      user: user._id,
      jobTitle: 'Software Engineer',
      jobDescription: 'We are looking for a skilled software engineer to join our team. The ideal candidate has experience with JavaScript, React, and Node.js.',
      resumeText: 'Experienced software developer with 5 years of experience in web development using JavaScript, React, and Node.js.',
      status: 'pending',
    });

    await interview.save();
    console.log('Created sample interview with ID:', interview._id);

    // Add the interview to the user's interviews array
    user.interviews.push(interview._id);
    await user.save();
    console.log('Added interview to user');

    console.log('Sample interview created successfully');
  } catch (error) {
    console.error('Error creating sample interview:', error);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB disconnected');
  }
}

createSampleInterview();