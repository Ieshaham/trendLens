// This service file provides functions to interact with the OpenAI API

// Replace with your actual API key in a real production environment
// For security, you would typically store this server-side or use environment variables
// never expose API keys in client-side code for production apps
const API_KEY = process.env.REACT_APP_OPENAI_API_KEY || '';

/**
 * Generate AI analysis for a fashion trend
 * @param {Object} trendData - Data about the trend including name, description, popularity metrics
 * @returns {Promise<string>} - AI-generated analysis of why the trend is popular
 */
export const generateTrendAnalysis = async (trendData) => {
  if (!API_KEY) {
    console.warn('No OpenAI API key provided. Using fallback analysis.');
    return getFallbackAnalysis(trendData);
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an expert fashion analyst who understands cultural trends, consumer behavior, and the fashion industry. Provide insightful, concise analysis about why fashion trends become popular.'
          },
          {
            role: 'user',
            content: `Analyze this fashion trend and explain why it's gaining popularity in about 2-3 sentences.
            
            Trend name: ${trendData.name}
            Description: ${trendData.description}
            Popularity over time: ${JSON.stringify(trendData.popularity)}
            Key items: ${trendData.keyItems.join(', ')}`
          }
        ],
        max_tokens: 150,
        temperature: 0.7
      })
    });

    const data = await response.json();
    
    if (data.error) {
      console.error('OpenAI API error:', data.error);
      return getFallbackAnalysis(trendData);
    }
    
    return data.choices[0].message.content.trim();

  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    return getFallbackAnalysis(trendData);
  }
};

/**
 * Fallback function to generate analysis when API is unavailable
 * @param {Object} trendData - Data about the trend
 * @returns {string} - Pre-defined or rule-based analysis
 */
const getFallbackAnalysis = (trendData) => {
  const currentPopularity = trendData.popularity[trendData.popularity.length - 1].score;
  const initialPopularity = trendData.popularity[0].score;
  const growth = currentPopularity - initialPopularity;
  
  if (growth > 30) {
    return `${trendData.name} has seen explosive growth due to strong social media presence, celebrity endorsements, and changing consumer values around self-expression. The trend aligns with broader cultural shifts toward individuality and authenticity.`;
  } else if (growth > 15) {
    return `${trendData.name} has gained steady popularity through a combination of industry support, digital content creators, and practical appeal to modern lifestyles. The trend represents a balance between functionality and fashion-forward thinking.`;
  } else if (growth > 0) {
    return `${trendData.name} has shown moderate growth as it appeals to specific market segments seeking distinctive aesthetics. While not mainstream, it maintains consistent appeal among fashion-forward consumers.`;
  } else {
    return `${trendData.name} has declined in popularity as new competing trends have emerged. However, it maintains a loyal following among certain demographics and may experience a revival cycle in future seasons.`;
  }
};

/**
 * Compare multiple trends and generate insights about their relationship
 * @param {Array} trends - Array of trend objects to compare
 * @returns {Promise<string>} - AI-generated comparative analysis
 */
export const compareTrends = async (trends) => {
  if (!API_KEY || trends.length < 2) {
    return "Please select at least two trends to compare their relationships and influences on each other.";
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an expert fashion analyst who understands relationships between different fashion trends. Provide concise, insightful comparative analysis.'
          },
          {
            role: 'user',
            content: `Compare these fashion trends and explain how they relate to or influence each other in 2-3 sentences:
            
            ${trends.map(trend => `Trend: ${trend.name}
Description: ${trend.description}`).join('\n\n')}`
          }
        ],
        max_tokens: 200,
        temperature: 0.7
      })
    });

    const data = await response.json();
    
    if (data.error) {
      console.error('OpenAI API error:', data.error);
      return "Unable to generate trend comparison at this time. Please try again later.";
    }
    
    return data.choices[0].message.content.trim();

  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    return "An error occurred while comparing trends. Please try again later.";
  }
};

export default {
  generateTrendAnalysis,
  compareTrends
};