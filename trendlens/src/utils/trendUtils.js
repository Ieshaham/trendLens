/**
 * Utility functions for processing trend data
 */

/**
 * Calculate the growth rate of a trend over a specific period
 * @param {Object} trend - Trend object with popularity data
 * @param {number} periodMonths - Number of months to consider (default: 3)
 * @returns {Object} Growth rate and category
 */
export const calculateGrowthRate = (trend, periodMonths = 3) => {
  const popularity = trend.popularity;
  
  if (!popularity || popularity.length < 2) {
    return { rate: 0, category: 'stable' };
  }
  
  // Get last data point
  const current = popularity[popularity.length - 1].score;
  
  // Get data point from periodMonths ago, or earliest available
  const compareIndex = Math.max(0, popularity.length - 1 - periodMonths);
  const previous = popularity[compareIndex].score;
  
  // Calculate absolute and percentage growth
  const absoluteGrowth = current - previous;
  const percentageGrowth = (absoluteGrowth / previous) * 100;
  
  // Determine growth category
  let category = 'stable';
  if (percentageGrowth > 15) {
    category = 'rapid-growth';
  } else if (percentageGrowth > 5) {
    category = 'growing';
  } else if (percentageGrowth < -15) {
    category = 'rapid-decline';
  } else if (percentageGrowth < -5) {
    category = 'declining';
  }
  
  return {
    rate: percentageGrowth.toFixed(1),
    absoluteChange: absoluteGrowth,
    category,
    current,
    previous
  };
};

/**
 * Find related trends based on similarity in descriptions and key items
 * @param {Object} targetTrend - The trend to find related trends for
 * @param {Array} allTrends - Array of all available trends
 * @param {number} limit - Maximum number of related trends to return
 * @returns {Array} Array of related trend objects
 */
export const findRelatedTrends = (targetTrend, allTrends, limit = 3) => {
  if (!targetTrend || !allTrends || allTrends.length <= 1) {
    return [];
  }
  
  // Create arrays of words from the target trend's description and key items
  const targetDescription = targetTrend.description.toLowerCase();
  const targetItems = targetTrend.keyItems.map(item => item.toLowerCase());
  
  // Calculate similarity scores for each trend
  const trendsWithScores = allTrends
    .filter(trend => trend.id !== targetTrend.id) // Exclude the target trend itself
    .map(trend => {
      let score = 0;
      
      // Check description similarity
      const trendDescription = trend.description.toLowerCase();
      if (trendDescription.includes(targetDescription) || targetDescription.includes(trendDescription)) {
        score += 3;
      }
      
      // Count matching words in descriptions
      const descWords = targetDescription.split(' ');
      descWords.forEach(word => {
        if (word.length > 3 && trendDescription.includes(word)) {
          score += 1;
        }
      });
      
      // Check for matching key items
      const trendItems = trend.keyItems.map(item => item.toLowerCase());
      targetItems.forEach(item => {
        if (trendItems.some(trendItem => trendItem.includes(item) || item.includes(trendItem))) {
          score += 2;
        }
      });
      
      return { trend, score };
    });
  
  // Sort by similarity score and take the top results
  return trendsWithScores
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.trend);
};

/**
 * Predict the future trajectory of a trend based on its historical popularity
 * This is a simple linear regression prediction
 * @param {Object} trend - Trend object with popularity data
 * @param {number} monthsAhead - Number of months to predict ahead
 * @returns {Array} Array of predicted data points
 */
export const predictTrendTrajectory = (trend, monthsAhead = 3) => {
  if (!trend?.popularity || trend.popularity.length < 3) {
    return [];
  }

  const data = trend.popularity;
  
  // Simple linear regression
  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumXX = 0;
  const n = data.length;
  
  for (let i = 0; i < n; i++) {
    sumX += i;
    sumY += data[i].score;
    sumXY += i * data[i].score;
    sumXX += i * i;
  }
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  
  // Generate predictions
  const lastMonth = data[data.length - 1].month;
  const [monthName, yearStr] = lastMonth.split(' ');
  const year = parseInt(yearStr);
  
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  let monthIndex = months.indexOf(monthName);
  
  const predictions = [];
  
  for (let i = 1; i <= monthsAhead; i++) {
    monthIndex = (monthIndex + 1) % 12;
    const predictionYear = monthIndex === 0 && i > 1 ? year + 1 : year;
    const predictionMonth = `${months[monthIndex]} ${predictionYear}`;
    
    // Predict score (constrained between 0 and 100)
    let predictionScore = intercept + slope * (n + i);
    predictionScore = Math.max(0, Math.min(100, Math.round(predictionScore)));
    
    predictions.push({
      month: predictionMonth,
      score: predictionScore,
      isPrediction: true
    });
  }
  
  return predictions;
};

/**
 * Group trends into categories based on their current popularity
 * @param {Array} trends - Array of trend objects
 * @returns {Object} Categories with arrays of trends
 */
export const categorizeTrends = (trends) => {
  if (!trends || !trends.length) {
    return { hot: [], popular: [], growing: [], declining: [] };
  }
  
  return trends.reduce((categories, trend) => {
    const currentScore = trend.popularity[trend.popularity.length - 1].score;
    const prevScore = trend.popularity[trend.popularity.length - 2]?.score || currentScore;
    
    if (currentScore >= 85) {
      categories.hot.push(trend);
    } else if (currentScore >= 65) {
      categories.popular.push(trend);
    } else if (currentScore > prevScore) {
      categories.growing.push(trend);
    } else {
      categories.declining.push(trend);
    }
    
    return categories;
  }, { hot: [], popular: [], growing: [], declining: [] });
};

export default {
  calculateGrowthRate,
  findRelatedTrends,
  predictTrendTrajectory,
  categorizeTrends
};