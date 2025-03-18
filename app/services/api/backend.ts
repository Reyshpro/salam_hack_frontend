import type { Learning, Project, Task  } from '../../types/models';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080';

class BackendAPI {
  private sessionId: string = '';



  // Set auth token for requests
  setSession(token: string) {
    this.sessionId = token;
  }

  private async fetchWithSession(endpoint: string, options: RequestInit = {}) {
    const headers = {
      'Content-Type': 'application/json',
    };

    

    const response = await fetch(`${API_BASE_URL}${endpoint}/${this.sessionId}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.statusText}`);
    }

    return response;
    }

    private async fetchWithSessionAndBody(endpoint: string,body :any , options: RequestInit = {}) {
      const headers = {
        'Content-Type': 'application/json',
      };
  
      
  
      const response = await fetch(`${API_BASE_URL}${endpoint}/${this.sessionId}`, {
        ...options,
        headers,
        body: body ? body : undefined,
      });
  
      if (!response.ok) {
        throw new Error(`API call failed: ${response.statusText}`);
      }
  
      return response;
      }

    private async fetchN(endpoint: string, options: RequestInit = {}) {
    const headers = {
      'Content-Type': 'application/json',
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

    async getLearnings(): Promise<Learning[]> {
    try {
      const response = await this.fetchWithSession('/learnings', {
      method: 'GET',
      });

      const learnings: Learning[] = await response.json();
      return learnings;
    } catch (error) {
      console.error('Error validating environment:', error);
      return [];
    }
  }

  async getProjects(id :string): Promise<Project[]> {
    try {
      const response = await this.fetchWithSessionAndBody('/projects',{id: id}, {
      method: 'POST',
      });

      const projects: Project[] = await response.json();
      return projects;
    } catch (error) {
      console.error('Error validating environment:', error);
      return [];
    }
  }

  async getTasks(id :string): Promise<Task[]> {
    try {
      const response = await this.fetchWithSessionAndBody('/tasks',{id: id}, {
      method: 'POST',
      });

      const tasks: Task[] = await response.json();
      return tasks;
    } catch (error) {
      console.error('Error validating environment:', error);
      return [];
    }
  }

  // // Project endpoints
  // async validateProjectCompletion(projectId: string): Promise<{
  //   isValid: boolean;
  //   feedback?: string;
  // }> {
  //   try {
  //     return await this.fetchWithAuth(`/api/projects/${projectId}/validate`, {
  //       method: 'POST',
  //     });
  //   } catch (error) {
  //     console.error('Error validating project:', error);
  //     return { isValid: false };
  //   }
  // }

  // // Task endpoints
  // async validateTaskCompletion(taskId: string, submission: string): Promise<{
  //   isValid: boolean;
  //   feedback: string;
  // }> {
  //   try {
  //     return await this.fetchWithAuth(`/api/tasks/${taskId}/validate`, {
  //       method: 'POST',
  //       body: JSON.stringify({
  //         submission,
  //       }),
  //     });
  //   } catch (error) {
  //     console.error('Error validating task:', error);
  //     return { isValid: false, feedback: 'Failed to validate task' };
  //   }
  // }

  // // Progress sync
  // async syncProgress(progress: UserProgress): Promise<void> {
  //   try {
  //     await this.fetchWithAuth('/api/progress/sync', {
  //       method: 'POST',
  //       body: JSON.stringify(progress),
  //     });
  //   } catch (error) {
  //     console.error('Error syncing progress:', error);
  //     throw error;
  //   }
  // }
}

export const backendAPI = new BackendAPI(); 