export const generateAIPlan = async (city, duration, vibes, pace) => {
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
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
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

export const generateFullTrip = async (destination, dates, budget, currency, travelers, pace, vibes) => {
  const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
  
  if (!apiKey) {
    console.warn("No Gemini API Key found. Falling back to mock trip data.");
    return generateMockFullTrip(destination, dates, budget, currency, travelers, pace, vibes);
  }

  const prompt = `
    Create a detailed travel itinerary for ${travelers} traveling to ${destination}.
    Dates: ${dates} (Calculate total days).
    Budget Target: ${currency} ${budget}.
    Pace: ${pace}. 
    Vibes/Interests: ${vibes.join(', ')}.
    
    Return EXACTLY a valid JSON object matching this schema:
    {
      "title": "A catchy trip title (e.g., 7-Day Tokyo Cultural Immersion)",
      "category": "Trending" | "Adventure" | "Couples" | "Budget Friendly",
      "image": "An unsplash image URL representing the destination (e.g. https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80)",
      "days": <number_of_days>,
      "activities": [
        {
          "date": "Day X",
          "time": "MORNING" | "AFTERNOON" | "EVENING",
          "title": "Activity Name",
          "category": "Activities" | "Food & Dining" | "Accommodation" | "Transportation" | "Miscellaneous",
          "estimatedCost": <number representing cost in chosen currency>,
          "bookingStatus": "Idea",
          "image": "A relevant unsplash photo URL"
        }
      ],
      "prepChecklist": {
        "weatherSummary": {
          "expectedConditions": "String description of weather",
          "seasonRisk": "String describing specific seasonal risks"
        },
        "packingAndFabrics": {
          "recommendedMaterials": ["Array", "of", "strings"],
          "avoidMaterials": ["Array", "of", "strings"],
          "essentialGear": [
            { "item": "Gear name", "checked": false }
          ]
        },
        "documentation": {
          "requirements": [
            { "item": "Doc name", "notes": "Details", "checked": false }
          ]
        },
        "healthAndMedicalAdvisories": {
          "highRiskConditions": [
            { "condition": "Condition name", "warning": "Warning text", "recommendation": "Rec text" }
          ],
          "generalTravelerRisks": [
            { "risk": "Risk name", "preventativeAction": "Action text" }
          ],
          "recommendedVaccines": ["Array", "of", "vaccines"]
        }
      }
    }
    
    Make sure to generate ${pace === 'Action-Packed' ? '3' : pace === 'Balanced' ? '2' : '1'} activities per day. 
    Ensure the sum of estimatedCost for all activities roughly approaches the budget target ${budget}.
  `;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });

    if (!response.ok) throw new Error('API Request Failed');

    const data = await response.json();
    let text = data.candidates[0].content.parts[0].text;
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(text);
    
    const stopId = `stop-${Date.now()}`;
    return {
      id: `trip-${Date.now()}`,
      title: parsed.title || `${parsed.days}-Day ${destination} Trip`,
      category: parsed.category || 'Trending',
      image: parsed.image || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80',
      progress: 0,
      status: 'Upcoming',
      days: parsed.days || 3,
      stops: [
        {
          id: stopId,
          city: destination,
          dates: dates,
          days: parsed.days || 3,
          status: 'Idea',
          transport: 'Plane',
          image: parsed.image || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80'
        }
      ],
      activities: (parsed.activities || []).map(a => ({
        ...a,
        id: `ai-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        stopId: stopId,
        actualCost: 0
      })),
      prepChecklist: parsed.prepChecklist || generateMockPrepChecklist()
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return generateMockFullTrip(destination, dates, budget, currency, travelers, pace, vibes);
  }
};

const generateMockFullTrip = (destination, dates, budget, currency, travelers, pace, vibes) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const generatedActivities = [];
      const times = ['MORNING', 'AFTERNOON', 'EVENING'];
      const categories = ['Activities', 'Food & Dining', 'Miscellaneous'];
      const days = 5;
      const stopId = `stop-${Date.now()}`;
      for (let i = 1; i <= days; i++) {
        for (let j = 0; j < (pace === 'Action-Packed' ? 3 : pace === 'Balanced' ? 2 : 1); j++) {
          generatedActivities.push({
            id: `ai-${Date.now()}-${i}-${j}`,
            stopId: stopId,
            date: `Day ${i}`,
            time: times[j % 3],
            title: `Explore ${vibes[j % vibes.length] || 'Local'} Highlights`,
            category: categories[j % 3],
            estimatedCost: Math.floor(Math.random() * (budget / (days * 3))) + 10,
            actualCost: 0,
            bookingStatus: 'Idea',
            image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=400&q=80'
          });
        }
      }
      
      resolve({
        id: `trip-${Date.now()}`,
        title: `${days}-Day ${destination} Getaway`,
        category: 'Trending',
        image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
        progress: 0,
        status: 'Upcoming',
        days: days,
        stops: [
          {
            id: stopId,
            city: destination,
            dates: dates,
            days: days,
            status: 'Idea',
            transport: 'Plane',
            image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80'
          }
        ],
        activities: generatedActivities,
        prepChecklist: generateMockPrepChecklist()
      });
    }, 3000);
  });
};

const generateMockPrepChecklist = () => ({
  weatherSummary: {
    expectedConditions: "Humid subtropical, heavy monsoon showers (24°C–31°C)",
    seasonRisk: "High UV index & sudden flash rain"
  },
  packingAndFabrics: {
    recommendedMaterials: ["Quick-dry merino wool", "Breathable linen", "Gore-Tex waterproof shell"],
    avoidMaterials: ["Heavy denim (slow to dry)", "Pure cotton base layers"],
    essentialGear: [
      { item: "Universal power adapter", checked: false },
      { item: "Mosquito repellent (DEET 30%+)", checked: false },
      { item: "Water purification tablets", checked: false }
    ]
  },
  documentation: {
    requirements: [
      { item: "Passport", notes: "Must be valid for 6 months beyond stay", checked: false },
      { item: "Tourist Visa", notes: "Check e-Visa requirements prior to arrival", checked: false }
    ]
  },
  healthAndMedicalAdvisories: {
    highRiskConditions: [
      { condition: "Cardiovascular", warning: "High humidity can increase cardiovascular strain.", recommendation: "Stay hydrated and avoid midday exertion." },
      { condition: "Asthma / COPD", warning: "Air quality may drop during peak traffic hours.", recommendation: "Carry rescue inhaler at all times." }
    ],
    generalTravelerRisks: [
      { risk: "Water-borne pathogens", preventativeAction: "Drink only bottled or boiled water. Avoid ice." },
      { risk: "Mosquito-borne illnesses", preventativeAction: "Use DEET and wear long sleeves at dusk." }
    ],
    recommendedVaccines: ["Hepatitis A", "Typhoid", "Routine vaccines"]
  }
});

export const generatePrepChecklist = async (destination, dates) => {
  const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
  if (!apiKey) return generateMockPrepChecklist();

  const prompt = `
    Create a detailed travel health, weather, and packing advisory for a trip to ${destination} during ${dates}.
    Return EXACTLY a valid JSON object matching this schema:
    {
      "weatherSummary": {
        "expectedConditions": "String description of weather",
        "seasonRisk": "String describing specific seasonal risks"
      },
      "packingAndFabrics": {
        "recommendedMaterials": ["Array", "of", "strings"],
        "avoidMaterials": ["Array", "of", "strings"],
        "essentialGear": [
          { "item": "Gear name", "checked": false }
        ]
      },
      "documentation": {
        "requirements": [
          { "item": "Doc name", "notes": "Details", "checked": false }
        ]
      },
      "healthAndMedicalAdvisories": {
        "highRiskConditions": [
          { "condition": "Condition name", "warning": "Warning text", "recommendation": "Rec text" }
        ],
        "generalTravelerRisks": [
          { "risk": "Risk name", "preventativeAction": "Action text" }
        ],
        "recommendedVaccines": ["Array", "of", "vaccines"]
      }
    }
  `;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });
    if (!response.ok) throw new Error('API Request Failed');
    const data = await response.json();
    let text = data.candidates[0].content.parts[0].text;
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini API Error:", error);
    return generateMockPrepChecklist();
  }
};

export default {
  generateAIPlan,
  generateFullTrip,
  generatePrepChecklist
};
