import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API with the API key
const genAI = new GoogleGenerativeAI(process.env.EXPO_PUBLIC_GEMINI_API_KEY || '');

export interface GeminiResponse {
  content: string;
  error?: string;
}

export class GeminiService {
  private model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  async generateProjects(language: string, level: string): Promise<GeminiResponse> {
    try {
      const prompt = `Generate 5 programming projects for ${language} at ${level} level. 
        Each project should include a title, description, and 5 tasks.`;
      
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return { content: response.text() };
    } catch (error) {
      return { content: '', error: 'Failed to generate projects' };
    }
  }

  async generateHelp(language: string, project: string, task: string): Promise<GeminiResponse> {
    try {
      const prompt = `Provide help and guidance for the task "${task}" in the project "${project}" using ${language}.`;
      
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return { content: response.text() };
    } catch (error) {
      return { content: '', error: 'Failed to generate help content' };
    }
  }
}

export const geminiService = new GeminiService(); 