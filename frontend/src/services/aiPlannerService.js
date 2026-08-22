const generateAIPlan = async (city, duration, vibes, pace, apiKey) => {
  // If API key exists, we could use fetch('https://api.openai.com/v1/chat/completions', ...)
  // For now, we will simulate a smart generator with a realistic delay and generated data.

  return new Promise((resolve) => {
    setTimeout(() => {
      const generatedActivities = [];
      const times = ['MORNING', 'AFTERNOON', 'EVENING'];
      const categories = ['Activities', 'Food & Dining', 'Miscellaneous'];
      
      for (let i = 1; i <= duration; i++) {
        for (let j = 0; j < (pace === 'Packed' ? 3 : pace === 'Balanced' ? 2 : 1); j++) {
          generatedActivities.push({
            id: `ai-${Date.now()}-${i}-${j}`,
            date: `Day ${i}`,
            time: times[j % 3],
            title: `Explore ${vibes[j % vibes.length] || 'City'} Highlights`,
            category: categories[j % 3],
            price: Math.floor(Math.random() * 5000) + 1000,
            actualCost: 0,
            bookingStatus: 'Idea',
            image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=400&q=80'
          });
        }
      }
      
      resolve({
        stops: [
          {
            id: `stop-${Date.now()}`,
            city: city,
            dates: `Day 1 - Day ${duration}`,
            days: duration,
            status: 'Idea',
            transport: 'Plane',
            image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80'
          }
        ],
        activities: generatedActivities
      });
    }, 1500); // simulate API latency
  });
};

export default {
  generateAIPlan
};
