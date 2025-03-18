// export interface User {
//   id: string;
//   email: string;
//   displayName?: string;
//   createdAt: Date;
// }

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

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  order: number;
  isCompleted: boolean;
}

// export interface UserProgress {
//   userId: string;
//   languageId: string;
//   projectId: string;
//   completedTasks: string[]; // Array of task IDs
//   lastUpdated: Date;
// }

// export interface AIGeneratedContent {
//   languageId: string;
//   projects: {
//     title: string;
//     description: string;
//     tasks: {
//       title: string;
//       description: string;
//     }[];
//   }[];
//   generatedAt: Date;
// } 