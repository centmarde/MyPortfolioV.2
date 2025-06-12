import Groq from "groq-sdk";
import { useState, useEffect } from 'react';
import axios from 'axios';

const apiKey = import.meta.env.VITE_DEEPSEEK_AI;

if (!apiKey) {
  throw new Error(
    "API key is missing or empty. Please provide a valid API key."
  );
}

const groq = new Groq({
  apiKey: apiKey,
  dangerouslyAllowBrowser: true,
});

function formatResponse(content: string): string {
  return content.replace(/\n/g, "<br><think>");
}

// Type definition for bio.json data
interface BioData {
  name: string;
  title: string;
  address: string;
  phone: string;
  description: string;
  resume: string;
  image: {
    primary: string;
    secondary: string;
  };
  social: {
    github: string;
    facebook: string;
    email: string;
  };
  skills: string[];
  languages: Array<{ name: string; level: string }> ;
  "tech stack": Array<{ name: string; level: string }> ;
}

// Type definitions for additional data files
interface WorksData {
  id: number;
  tag: string;
  title: string;
  description: string;
  image: string;
  images: string[];
  demoLink: string;
  codeLink: string;
  techStack: string[];
}

interface HighlightsData {
  keySkills: string[];
  notableAchievements: string[];
  professionalSummary: string;
  experience: Array<{
    title: string;
    company: string;
    location: string;
    period: string;
    responsibilities: string[];
  }>;
  education: Array<{
    degree: string;
    school: string;
    period: string;
    details: string;
    achievements: string[];
    thesis?: string;
  }>;
  training: {
    recentTraining: Array<{
      title: string;
      provider: string;
      date: string;
      description: string;
    }>;
    conferences: Array<{
      name: string;
      location: string;
      year: string;
    }>;
    speaking: any[];
  };
  organizations: {
    professional: Array<{
      name: string;
      role: string;
      period: string;
      description: string;
    }>;
    volunteer: any[];
    alumni: Array<{
      name: string;
      role: string;
      period: string;
    }>;
  };
}

interface AchievementsData {
  topAwards: Array<{
    id: number;
    title?: string;
    issuer?: string;
    date?: string;
    image?: string;
  }>;
  certificates: Array<{
    id: number;
    title: string;
    issuer: string;
    date: string;
    image: string;
  }>;
}

// Combined portfolio data interface
interface PortfolioData {
  bio: BioData | null;
  works: WorksData[] | null;
  highlights: HighlightsData | null;
  achievements: AchievementsData | null;
}

export function useResponse() {
  const [chatContent, setChatContent] = useState("");
  const [portfolioData, setPortfolioData] = useState<PortfolioData>({
    bio: null,
    works: null,
    highlights: null,
    achievements: null
  });

  // Fetch all portfolio data on component mount
  useEffect(() => {
    const fetchBioData = async () => {
      try {
        const [bioResponse, worksResponse, highlightsResponse, achievementsResponse] = await Promise.all([
          axios.get('/data/bio.json'),
          axios.get('/data/works.json'),
          axios.get('/data/highlights.json'),
          axios.get('/data/achievements.json')
        ]);

        setPortfolioData({
          bio: bioResponse.data,
          works: worksResponse.data,
          highlights: highlightsResponse.data,
          achievements: achievementsResponse.data
        });
      } catch (error) {
        console.error('Error fetching portfolio data:', error);
      }
    };

    fetchBioData();
  }, []);
  
  async function getBioResponse(query: string): Promise<string> {
    setChatContent("");
    
    if (!portfolioData.bio) {
      setChatContent("Loading portfolio information...");
      return "Loading portfolio information...";
    }
    
    // Create a context from the combined portfolio data
    const portfolioContext = JSON.stringify(portfolioData);
    
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are an AI assistant for ${portfolioData.bio.name}, a ${portfolioData.bio.title}. 
          Answer questions about him using only the following portfolio information: ${portfolioContext}.
          If you don't know the answer based on the provided information, say that you don't have that information.
          Keep responses professional and friendly.`
        },
        {
          role: "user",
          content: query
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.6,
      max_completion_tokens: 600,
      top_p: 0.95,
      stream: true,
      stop: null,
    });

    let fullResponse = "";
    try {
      for await (const chunk of chatCompletion) {
        const content = chunk.choices[0]?.delta?.content || "";
        fullResponse += content;
        setChatContent(prev => prev + formatResponse(content));
      }
      
      // Make sure we've received everything before returning
      console.log("Full response length:", fullResponse.length);
      
      // Small delay to ensure UI updates completely
      await new Promise(resolve => setTimeout(resolve, 100));
      
      return fullResponse;
    } catch (error) {
      console.error("Error during streaming response:", error);
      setChatContent(prev => prev + formatResponse("\nError receiving complete response."));
      return fullResponse || "Error receiving complete response.";
    }
  }

  return {
    chatContent,
    getBioResponse,
    portfolioData
  };
}