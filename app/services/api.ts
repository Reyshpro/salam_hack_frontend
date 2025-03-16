import { AIGeneratedContent, Language } from '../types';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

interface GenerateProjectParams {
  language: string;
  level: string;
  goal: string;
  projectNumber: number;
}

class APIService {
  private async fetchWithTimeout(
    url: string,
    options: RequestInit,
    timeout = 10000
  ): Promise<Response> {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(id);
      return response;
    } catch (error) {
      clearTimeout(id);
      throw error;
    }
  }

  async generateProject({
    language,
    level,
    goal,
    projectNumber,
  }: GenerateProjectParams): Promise<AIGeneratedContent> {
    try {
      const response = await this.fetchWithTimeout(
        `${API_BASE_URL}/api/generate-project`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            language,
            level,
            goal,
            projectNumber,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to generate project content');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error generating project:', error);
      // Return fallback content in Arabic
      return {
        projectName: 'مشروع تجريبي',
        projectDescription: 'وصف المشروع غير متوفر حاليا. يرجى المحاولة مرة أخرى لاحقا.',
        tasks: Array(5).fill({
          title: 'مهمة تجريبية',
          description: 'وصف المهمة غير متوفر حاليا.',
        }),
      };
    }
  }

  async validateLanguageEnvironment(
    language: string,
    environment: string
  ): Promise<boolean> {
    try {
      const response = await this.fetchWithTimeout(
        `${API_BASE_URL}/api/validate-environment`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            language,
            environment,
          }),
        }
      );

      if (!response.ok) {
        return false;
      }

      const { isValid } = await response.json();
      return isValid;
    } catch (error) {
      console.error('Error validating environment:', error);
      return true; // Default to true to not block user progress
    }
  }

  async getProjectHints(
    language: string,
    projectId: string,
    taskId: string
  ): Promise<string[]> {
    try {
      const response = await this.fetchWithTimeout(
        `${API_BASE_URL}/api/get-hints`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            language,
            projectId,
            taskId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch hints');
      }

      const { hints } = await response.json();
      return hints;
    } catch (error) {
      console.error('Error fetching hints:', error);
      return [
        'عذراً، التلميحات غير متوفرة حالياً',
        'حاول تقسيم المشكلة إلى أجزاء أصغر',
        'راجع الدروس السابقة للمساعدة',
      ];
    }
  }

  async validateTaskCompletion(
    language: string,
    projectId: string,
    taskId: string,
    solution: string
  ): Promise<{
    isValid: boolean;
    feedback: string;
  }> {
    try {
      const response = await this.fetchWithTimeout(
        `${API_BASE_URL}/api/validate-task`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            language,
            projectId,
            taskId,
            solution,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to validate task');
      }

      return await response.json();
    } catch (error) {
      console.error('Error validating task:', error);
      return {
        isValid: true, // Default to true in case of API failure
        feedback: 'عذراً، لم نتمكن من التحقق من الحل. يمكنك المتابعة إلى المهمة التالية.',
      };
    }
  }
}

export const apiService = new APIService();
