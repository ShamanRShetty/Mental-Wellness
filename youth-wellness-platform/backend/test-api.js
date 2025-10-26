const axios = require('axios');

const BASE_URL = 'http://localhost:8080/api';
let sessionId = null;

async function testAPI() {
  try {
    console.log('🧪 Starting API Tests...\n');

    // Test 1: Initialize Session
    console.log('1️⃣  Testing: Initialize Session');
    const initResponse = await axios.post(`${BASE_URL}/chat/init`, {
      language: 'en'
    });
    sessionId = initResponse.data.sessionId;
    console.log('✅ Session initialized:', sessionId);
    console.log('   Greeting:', initResponse.data.message, '\n');

    // Test 2: Send Message
    console.log('2️⃣  Testing: Send Message');
    const chatResponse = await axios.post(`${BASE_URL}/chat/message`, {
      sessionId,
      message: 'I am feeling very anxious about my exams'
    });
    console.log('✅ AI Response:', chatResponse.data.message);
    console.log('   Sentiment:', chatResponse.data.sentiment.userSentiment, '\n');

    // Test 3: Send Crisis Message
    console.log('3️⃣  Testing: Crisis Detection');
    const crisisResponse = await axios.post(`${BASE_URL}/chat/message`, {
      sessionId,
      message: 'I feel hopeless and don\'t want to live anymore'
    });
    console.log('✅ Crisis Detected:', crisisResponse.data.crisis?.detected);
    console.log('   Severity:', crisisResponse.data.crisis?.severity);
    console.log('   Helplines provided:', crisisResponse.data.crisis?.helplines?.length, '\n');

    // Test 4: Log Mood
    console.log('4️⃣  Testing: Log Mood');
    const moodResponse = await axios.post(`${BASE_URL}/mood/log`, {
      sessionId,
      mood: 'sad',
      intensity: 7,
      note: 'Exam stress',
      triggers: ['exams', 'pressure'],
      activities: ['studied']
    });
    console.log('✅ Mood logged:', moodResponse.data.moodEntry.mood);
    console.log('   Total entries:', moodResponse.data.totalEntries, '\n');

    // Test 5: Seed Resources
    console.log('5️⃣  Testing: Seed Resources');
    const seedResponse = await axios.post(`${BASE_URL}/resources/seed`);
    console.log('✅ Resources seeded:', seedResponse.data.count, '\n');

    // Test 6: Get Resources
    console.log('6️⃣  Testing: Get Resources');
    const resourcesResponse = await axios.get(`${BASE_URL}/resources`);
    console.log('✅ Resources retrieved:', resourcesResponse.data.count);
    console.log('   First resource:', resourcesResponse.data.resources[0]?.title, '\n');

    console.log('🎉 All tests passed!\n');
} catch (error) {
console.error('❌ Test failed:', error.response?.data || error.message);
}
}
// Run tests
testAPI();