
// This is a mock implementation for development purposes only.
// In production, this would be a real backend endpoint.

// IMPORTANT: This is just for development, never put actual API keys in frontend code
const MOCK_RESPONSES: Record<string, string> = {
  "hello": "Hello! How can I help you today?",
  "who are you": "I'm Suchandra's AI assistant, designed to help visitors learn more about her skills and projects.",
  "default": "Thanks for your message! I'm an AI assistant here to help answer questions about Suchandra's portfolio. What would you like to know about her skills, projects, or experience?"
};

export async function mockChatCompletion(messages: Array<{role: string, content: string}>): Promise<string> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Get the last user message
  const lastUserMessage = messages.filter(m => m.role === 'user').pop();
  if (!lastUserMessage) return MOCK_RESPONSES.default;
  
  const userMessage = lastUserMessage.content.toLowerCase();
  
  // Check for keywords in the message and return appropriate responses
  if (userMessage.includes('hello') || userMessage.includes('hi')) {
    return MOCK_RESPONSES.hello;
  } else if (userMessage.includes('who are you') || userMessage.includes('your name')) {
    return MOCK_RESPONSES["who are you"];  // Fixed this line - added quotes
  } else if (userMessage.includes('project')) {
    return "Suchandra has worked on several impressive projects including an AI-Powered Educational Chatbot and a Smart Health Tracking App. Would you like to know more about a specific project?";
  } else if (userMessage.includes('skill') || userMessage.includes('experience')) {
    return "Suchandra is skilled in Python, React, TensorFlow, and many other technologies. She has experience as a Machine Learning Intern and Web Development Intern.";
  } else if (userMessage.includes('contact') || userMessage.includes('hire')) {
    return "You can contact Suchandra through the contact form on this website or via her LinkedIn profile. She's currently open to internship and job opportunities!";
  }
  
  return MOCK_RESPONSES.default;
}
