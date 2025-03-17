export interface Learning {
    id: string;
    language: string;
    level: string;
    framework: string;
    goal: string;
    title: string;
    description: string;
  }

  export interface Project {
    id: string;
    order: number;
    title: string;
    description: string;
    isLocked: boolean;
    learningId: string;
    progress: string;
  }
  

  export async function getLearnings(sessionId: string): Promise<Learning[]> {
    try {
      const response = await fetch(`http://localhost:8080/learnings/55`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'    
        } 
      });
   
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch learnings');
      }
  
      const learnings: Learning[] = await response.json();
      return learnings;
    } catch (error) {
      console.error('Error fetching learnings:', error);
      throw error;
    }
  }

  export async function getProjects(sessionId: string, parentId: string): Promise<Project[]> {
    try {
      const response = await fetch(`http://localhost:8080/projects/55`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'    
        },
        body: JSON.stringify({
            'id': parentId
        })
      });
   
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch learnings');
      }
  
      const learnings: Project[] = await response.json();
      return learnings;
    } catch (error) {
      console.error('Error fetching learnings:', error);
      throw error;
    }
  }
  
  // Example usage
  export const displayLearnings = async (sessionId: string) => {
    try {
      const learnings = await getLearnings(sessionId);
      console.log('Learnings:', learnings);
      
      // You can process the learnings here
      learnings.forEach(learning => {
        console.log(`Title: ${learning.title}, Language: ${learning.language}, Level: ${learning.level}`);
      });
      
      return learnings;
    } catch (error) {
      console.error('Failed to display learnings:', error);
    }
  };