const generateAIPlan = async (city, duration, vibes, pace) => {
  const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
  
  if (!apiKey) {
    console.warn("No Gemini API Key found. Falling back to mock data.");
    return generateMockPlan(city, duration, vibes, pace);
  }

  const prompt = `
    Create a ${duration}-day travel itinerary for ${city}.
    Pace: ${pace}. 
    Vibes/Interests: ${vibes.join(', ')}.
    
    Return EXACTLY a valid JSON object (no markdown formatting, no backticks, just raw JSON) in the following format:
    {
      "activities": [
        {
          "date": "Day X",
          "time": "MORNING" | "AFTERNOON" | "EVENING",
          "title": "Activity Name",
          "category": "Activities" | "Food & Dining" | "Accommodation" | "Transportation" | "Miscellaneous",
          "estimatedCost": <number representing cost in local currency>,
          "bookingStatus": "Idea",
          "image": "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=400&q=80"
        }
      ]
    }
    
    Make sure to generate ${pace === 'Packed' ? '3' : pace === 'Balanced' ? '2' : '1'} activities per day. 
    Ensure estimatedCost is a realistic number.
  `;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    if (!response.ok) throw new Error('API Request Failed');

    const data = await response.json();
    let text = data.candidates[0].content.parts[0].text;
    
    // Clean up potential markdown formatting from Gemini
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const parsed = JSON.parse(text);
    
    return {
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
      activities: parsed.activities.map(a => ({
        ...a,
        id: `ai-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        actualCost: 0
      }))
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return generateMockPlan(city, duration, vibes, pace);
  }
};

const generateMockPlan = (city, duration, vibes, pace) => {
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
            estimatedCost: Math.floor(Math.random() * 5000) + 1000,
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
