/**
 * Predefined empathetic responses for different scenarios
 */

const greetings = [
  "Hello! I'm here to listen and support you. How are you feeling today?",
  "Hi there! This is a safe space. What's on your mind?",
  "Welcome! I'm here for you. Would you like to talk about something?"
];

const crisisResponses = {
  high: {
    message: "I'm really concerned about what you're sharing. Your feelings are valid, but I want to make sure you're safe.",
    helplines: [
      {
        name: "Vandrevala Foundation",
        number: "1860-2662-345 / 1800-2333-330",
        hours: "24/7",
        description: "Free mental health support and crisis intervention"
      },
      {
        name: "AASRA",
        number: "91-9820466726",
        hours: "24/7",
        description: "Crisis helpline for suicide prevention"
      },
      {
        name: "iCall",
        number: "91-9152987821",
        hours: "Mon-Sat, 8 AM - 10 PM",
        description: "Psychosocial helpline by TISS"
      },
      {
        name: "Snehi",
        number: "91-22-27546669",
        hours: "24/7",
        description: "Crisis intervention for emotional support"
      }
    ],
    urgentActions: [
      "If you're in immediate danger, please call 112 (emergency services)",
      "Reach out to a trusted friend or family member right now",
      "Consider visiting the nearest hospital emergency room"
    ]
  },
  medium: {
    message: "I hear that you're going through a difficult time. It's brave of you to reach out. Have you considered talking to a counselor?",
    resources: [
      "Consider reaching out to a trusted adult or friend",
      "School/college counseling services might be helpful",
      "Online therapy platforms like BetterHelp or YourDOST"
    ]
  },
  low: {
    message: "Thank you for sharing that with me. It sounds challenging. Would you like to explore some coping strategies together?",
    suggestions: [
      "Let's try some breathing exercises",
      "Would you like to journal about your feelings?",
      "Sometimes a short walk can help clear the mind"
    ]
  }
};

const moodCheckIns = {
  very_sad: "I'm sorry you're feeling this way. Your emotions are valid. Would you like to talk about what's making you feel down?",
  sad: "It sounds like you're having a tough day. What's been weighing on your mind?",
  neutral: "How has your day been overall? Sometimes it helps to reflect on the small moments.",
  happy: "I'm glad you're feeling good! What brought joy to your day?",
  very_happy: "That's wonderful! It's great to celebrate positive moments. What made today special?"
};

const encouragements = [
  "You're taking an important step by reaching out. That takes courage.",
  "Your feelings are valid, and you deserve support.",
  "It's okay to not be okay. You're not alone in this.",
  "Taking care of your mental health is a sign of strength.",
  "Every small step forward is progress. Be proud of yourself."
];

const copingStrategies = {
  anxiety: [
    "Try the 5-4-3-2-1 grounding technique: Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste",
    "Practice deep breathing: Breathe in for 4 counts, hold for 4, out for 4",
    "Write down your worries and challenge negative thoughts"
  ],
  stress: [
    "Take a 10-minute break to do something you enjoy",
    "Break large tasks into smaller, manageable steps",
    "Talk to someone you trust about what's stressing you"
  ],
  sadness: [
    "Reach out to a friend or family member",
    "Do something creative - draw, write, or listen to music",
    "Practice self-compassion and be kind to yourself"
  ],
  loneliness: [
    "Join online or offline communities with shared interests",
    "Volunteer for a cause you care about",
    "Start small conversations with classmates or neighbors"
  ]
};

function getRandomGreeting() {
  return greetings[Math.floor(Math.random() * greetings.length)];
}

function getRandomEncouragement() {
  return encouragements[Math.floor(Math.random() * encouragements.length)];
}

module.exports = {
  greetings,
  crisisResponses,
  moodCheckIns,
  encouragements,
  copingStrategies,
  getRandomGreeting,
  getRandomEncouragement
};