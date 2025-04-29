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

export function useResponse() {
  const [chatContent, setChatContent] = useState("");
  const [bioData, setBioData] = useState<BioData | null>(null);

  // Fetch bio data on component mount
  useEffect(() => {
    const fetchBioData = async () => {
      try {
        const response = await axios.get('/data/bio.json');
        setBioData(response.data);
      } catch (error) {
        console.error('Error fetching bio data:', error);
      }
    };

    fetchBioData();
  }, []);

  async function getRecommendedAction(pestName: string): Promise<string> {
    setChatContent("");
    
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an agricultural expert. Provide specific treatment recommendations."
        },
        {
          role: "user",
          content: `Provide a very short overview about ${pestName} in crops.`
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
    for await (const chunk of chatCompletion) {
      const content = chunk.choices[0]?.delta?.content || "";
      fullResponse += content;
      setChatContent(prev => prev + formatResponse(content));
    }
    
    return fullResponse;
  }
  
  async function getBioResponse(query: string): Promise<string> {
    setChatContent("");
    
    if (!bioData) {
      setChatContent("Loading portfolio information...");
      return "Loading portfolio information...";
    }
    
    // Create a context from the bio data
    const bioContext = JSON.stringify(bioData);
    
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are an AI assistant for ${bioData.name}, a ${bioData.title}. 
          Answer questions about him using only the following portfolio information: ${bioContext}.
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
    getRecommendedAction,
    getBioResponse,
    bioData
  };
}