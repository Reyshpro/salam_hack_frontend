export interface Task {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  isLocked: boolean;
  aiHelp?: string;
  requirements?: string[];
  hints?: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  tasks: Task[];
  isCompleted: boolean;
  isLocked: boolean;
  aiContext?: string;
  learningObjectives?: string[];
}

export interface Language {
  id: string;
  name: string;
  environment: string;
  goal: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  projects: Project[];
  progress: number;
  createdAt: string;
}

export interface UserProgress {
  currentProjectId: string | null;
  currentTaskId: string | null;
  completedProjects: string[];
  completedTasks: string[];
  lastCompletedAt?: string;
}

export interface AIGeneratedContent {
  projectName: string;
  projectDescription: string;
  aiContext: string;
  learningObjectives: string[];
  tasks: {
    title: string;
    description: string;
    aiHelp: string;
    requirements: string[];
    hints: string[];
  }[];
}
