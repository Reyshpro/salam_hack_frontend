import type { Language, Project, Task, UserProgress } from '../../types/models';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080';

class BackendAPI {
  private authToken: string = '';

  // Set auth token for requests
  setAuthToken(token: string) {
    this.authToken = token;
  }

  private async fetchWithAuth(endpoint: string, options: RequestInit = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...(this.authToken ? { 'Authorization': `Bearer ${this.authToken}` } : {}),
      ...options.headers,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.statusText}`);
    }

    return response.json();
  }

  // Language endpoints
  async validateEnvironment(language: string, environment: string): Promise<boolean> {
    try {
      const response = await this.fetchWithAuth('/api/validate-environment', {
        method: 'POST',
        body: JSON.stringify({
          language,
          environment,
        }),
      });
      return response.isValid;
    } catch (error) {
      console.error('Error validating environment:', error);
      return false;
    }
  }

  // Project endpoints
  async validateProjectCompletion(projectId: string): Promise<{
    isValid: boolean;
    feedback?: string;
  }> {
    try {
      return await this.fetchWithAuth(`/api/projects/${projectId}/validate`, {
        method: 'POST',
      });
    } catch (error) {
      console.error('Error validating project:', error);
      return { isValid: false };
    }
  }

  // Task endpoints
  async validateTaskCompletion(taskId: string, submission: string): Promise<{
    isValid: boolean;
    feedback: string;
  }> {
    try {
      return await this.fetchWithAuth(`/api/tasks/${taskId}/validate`, {
        method: 'POST',
        body: JSON.stringify({
          submission,
        }),
      });
    } catch (error) {
      console.error('Error validating task:', error);
      return { isValid: false, feedback: 'Failed to validate task' };
    }
  }

  // Progress sync
  async syncProgress(progress: UserProgress): Promise<void> {
    try {
      await this.fetchWithAuth('/api/progress/sync', {
        method: 'POST',
        body: JSON.stringify(progress),
      });
    } catch (error) {
      console.error('Error syncing progress:', error);
      throw error;
    }
  }
}

export const backendAPI = new BackendAPI(); 