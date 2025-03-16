export interface Task {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  isLocked: boolean;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  tasks: Task[];
  isCompleted: boolean;
  isLocked: boolean;
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
}

export interface AIGeneratedContent {
  projectName: string;
  projectDescription: string;
  tasks: {
    title: string;
    description: string;
  }[];
}
