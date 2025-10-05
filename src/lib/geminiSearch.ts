// lib/geminiSearch.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export interface SearchFilters {
  categories?: string[];
  campuses?: string[];
  dateRange?: string;
  keywords?: string[];
}

export async function parseNaturalLanguageQuery(query: string): Promise<SearchFilters> {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
You are an event search assistant. Parse the user's query and extract structured filters.

User Query: "${query}"

RULES FOR CATEGORY MATCHING:
Think semantically. Don't just match exact words - understand INTENT and CONTEXT.

Technology category includes: coding, programming, web dev, app development, software, AI, ML, machine learning, data science, cybersecurity, hackathon, tech, computer science, React, Python, Java, databases, cloud, DevOps, game dev, mobile dev, AR, VR, blockchain, etc.

Business category includes: entrepreneurship, startup, pitch, business plan, finance, marketing, sales, MBA, consulting, etc.

Networking category includes: meet people, connect, professionals, career fair, mixer, social, community building, etc.

Health & Wellness category includes: mental health, fitness, yoga, meditation, wellness, mindfulness, stress relief, nutrition, etc.

Cultural category includes: food festival, international, diversity, heritage, traditions, cultural celebration, music, art, etc.

Career category includes: job, internship, resume, interview, professional development, career panel, industry talks, etc.

Environment category includes: sustainability, climate, green, eco-friendly, recycling, conservation, nature, etc.

IMPORTANT: Understand the MEANING, not just keywords. "React workshop" = Technology even though it doesn't say "tech". "Pitch competition" = Business even without saying "business".

Available campuses: Burnaby, Surrey, Vancouver
Date ranges: Today, Tomorrow, This weekend, Next week, This month

Return ONLY valid JSON. No markdown, no backticks, no explanation.

Format:
{
  "categories": ["exact category names that match the INTENT"],
  "campuses": ["exact campus names"],
  "dateRange": "exact date range or empty string",
  "keywords": ["extract key terms from query"]
}

Examples:
Query: "React workshops"
{"categories": ["Technology"], "campuses": [], "dateRange": "", "keywords": ["react", "workshops"]}

Query: "AI and machine learning events"
{"categories": ["Technology"], "campuses": [], "dateRange": "", "keywords": ["ai", "machine", "learning"]}

Query: "startup pitch night"
{"categories": ["Business"], "campuses": [], "dateRange": "", "keywords": ["startup", "pitch"]}

Query: "meet other developers"
{"categories": ["Technology", "Networking"], "campuses": [], "dateRange": "", "keywords": ["developers"]}

Query: "food festival this weekend"
{"categories": ["Cultural"], "campuses": [], "dateRange": "This weekend", "keywords": ["food", "festival"]}

Now parse this query (think about INTENT and CONTEXT, not just exact words):
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('Gemini raw response:', text);
    
    let cleanText = text.trim();
    cleanText = cleanText.replace(/^```json\s*/g, '');
    cleanText = cleanText.replace(/^```\s*/g, '');
    cleanText = cleanText.replace(/```\s*$/g, '');
    cleanText = cleanText.trim();
    
    console.log('Cleaned response:', cleanText);
    
    const filters: SearchFilters = JSON.parse(cleanText);
    console.log('Parsed filters:', filters);
    return filters;
  } catch (error) {
    console.error('Error parsing query with Gemini:', error);
    
    // Smarter fallback with semantic keyword detection
    const lowerQuery = query.toLowerCase();
    const fallbackFilters: SearchFilters = {
      keywords: query.split(' ').filter(word => word.length > 2),
      categories: []
    };
    
    // Technology - very broad matching
    const techKeywords = ['tech', 'coding', 'programming', 'software', 'web', 'app', 'ai', 
      'machine learning', 'ml', 'data', 'cyber', 'hack', 'developer', 'dev', 'computer',
      'react', 'python', 'java', 'javascript', 'code', 'game', 'mobile', 'cloud', 'api'];
    if (techKeywords.some(kw => lowerQuery.includes(kw))) {
      fallbackFilters.categories!.push('Technology');
    }
    
    // Business
    const bizKeywords = ['business', 'startup', 'entrepreneur', 'pitch', 'finance', 'marketing'];
    if (bizKeywords.some(kw => lowerQuery.includes(kw))) {
      fallbackFilters.categories!.push('Business');
    }
    
    // Networking
    const networkKeywords = ['network', 'meet', 'connect', 'social', 'mixer', 'community'];
    if (networkKeywords.some(kw => lowerQuery.includes(kw))) {
      fallbackFilters.categories!.push('Networking');
    }
    
    // Cultural
    const culturalKeywords = ['food', 'festival', 'culture', 'international', 'diversity'];
    if (culturalKeywords.some(kw => lowerQuery.includes(kw))) {
      fallbackFilters.categories!.push('Cultural');
    }
    
    console.log('Using fallback filters:', fallbackFilters);
    return fallbackFilters;
  }
}

export function applyFiltersToEvents(events: any[], filters: SearchFilters): any[] {
  return events.filter(event => {
    // Category filter
    if (filters.categories && filters.categories.length > 0) {
      if (!filters.categories.includes(event.category)) return false;
    }

    // Campus filter
    if (filters.campuses && filters.campuses.length > 0) {
      if (!filters.campuses.includes(event.campus)) return false;
    }

    // Date filter
    if (filters.dateRange) {
      const eventDate = new Date(event.start_at);
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      switch (filters.dateRange) {
        case 'Today':
          if (eventDate.toDateString() !== today.toDateString()) return false;
          break;
        case 'Tomorrow':
          if (eventDate.toDateString() !== tomorrow.toDateString()) return false;
          break;
        case 'This weekend':
          const dayOfWeek = eventDate.getDay();
          if (dayOfWeek !== 0 && dayOfWeek !== 6) return false;
          break;
        case 'Next week':
          const nextWeek = new Date(today);
          nextWeek.setDate(nextWeek.getDate() + 7);
          if (eventDate > nextWeek || eventDate < today) return false;
          break;
        case 'This month':
          if (eventDate.getMonth() !== today.getMonth()) return false;
          break;
      }
    }

    // Keyword filter
    if (filters.keywords && filters.keywords.length > 0) {
      const searchableText = `${event.title} ${event.description} ${event.clubs?.name} ${event.tags?.join(' ')}`.toLowerCase();
      const matchesKeyword = filters.keywords.some(keyword => 
        searchableText.includes(keyword.toLowerCase())
      );
      if (!matchesKeyword) return false;
    }

    return true;
  });
}