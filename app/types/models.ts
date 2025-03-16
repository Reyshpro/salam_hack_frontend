export interface User {
  id: string;
  email: string;
  displayName?: string;
  createdAt: Date;
}

export interface Language {
  id: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  description: string;
  environment?: string;
}

export interface Project {
  id: string;
  languageId: string;
  title: string;
  description: string;
  order: number;
  createdAt: Date;
  tasks: Task[];
  isCompleted: boolean;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  order: number;
  isCompleted: boolean;
  helpContent?: string;
}

export interface UserProgress {
  userId: string;
  languageId: string;
  projectId: string;
  completedTasks: string[]; // Array of task IDs
  lastUpdated: Date;
}

export interface AIGeneratedContent {
  languageId: string;
  projects: {
    title: string;
    description: string;
    tasks: {
      title: string;
      description: string;
    }[];
  }[];
  generatedAt: Date;
} 