import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Language, UserProgress, AIGeneratedContent } from '../types';

interface AppState {
  // Languages state
  languages: Language[];
  addLanguage: (language: Language) => void;
  removeLanguage: (id: string) => void;
  updateLanguageProgress: (id: string, progress: number) => void;

  // Progress tracking
  progress: { [languageId: string]: UserProgress };
  setCurrentProject: (languageId: string, projectId: string | null) => void;
  setCurrentTask: (languageId: string, taskId: string | null) => void;
  completeTask: (languageId: string, projectId: string, taskId: string) => void;
  completeProject: (languageId: string, projectId: string) => void;

  // AI content integration
  updateProjectContent: (
    languageId: string,
    projectId: string,
    content: AIGeneratedContent
  ) => void;
}

const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      languages: [],
      progress: {},

      addLanguage: (language) =>
        set((state) => ({
          languages: [...state.languages, language],
          progress: {
            ...state.progress,
            [language.id]: {
              currentProjectId: language.projects[0]?.id || null,
              currentTaskId: language.projects[0]?.tasks[0]?.id || null,
              completedProjects: [],
              completedTasks: [],
            },
          },
        })),

      removeLanguage: (id) =>
        set((state) => ({
          languages: state.languages.filter((lang) => lang.id !== id),
          progress: Object.fromEntries(
            Object.entries(state.progress).filter(([key]) => key !== id)
          ),
        })),

      updateLanguageProgress: (id, progress) =>
        set((state) => ({
          languages: state.languages.map((lang) =>
            lang.id === id ? { ...lang, progress } : lang
          ),
        })),

      setCurrentProject: (languageId, projectId) =>
        set((state) => ({
          progress: {
            ...state.progress,
            [languageId]: {
              ...state.progress[languageId],
              currentProjectId: projectId,
              currentTaskId: projectId
                ? state.languages
                    .find((l) => l.id === languageId)
                    ?.projects.find((p) => p.id === projectId)
                    ?.tasks[0]?.id || null
                : null,
            },
          },
        })),

      setCurrentTask: (languageId, taskId) =>
        set((state) => ({
          progress: {
            ...state.progress,
            [languageId]: {
              ...state.progress[languageId],
              currentTaskId: taskId,
            },
          },
        })),

      completeTask: (languageId, projectId, taskId) =>
        set((state) => {
          const languageProgress = state.progress[languageId];
          const completedTasks = [...languageProgress.completedTasks, taskId];

          // Find the project and check if all tasks are completed
          const project = state.languages
            .find((l) => l.id === languageId)
            ?.projects.find((p) => p.id === projectId);

          const allTasksCompleted =
            project?.tasks.every((task) => completedTasks.includes(task.id)) ||
            false;

          return {
            languages: state.languages.map((lang) =>
              lang.id === languageId
                ? {
                    ...lang,
                    projects: lang.projects.map((proj) =>
                      proj.id === projectId
                        ? {
                            ...proj,
                            isCompleted: allTasksCompleted,
                            tasks: proj.tasks.map((task) =>
                              task.id === taskId
                                ? { ...task, isCompleted: true }
                                : task
                            ),
                          }
                        : proj
                    ),
                  }
                : lang
            ),
            progress: {
              ...state.progress,
              [languageId]: {
                ...languageProgress,
                completedTasks,
                completedProjects: allTasksCompleted
                  ? [...languageProgress.completedProjects, projectId]
                  : languageProgress.completedProjects,
              },
            },
          };
        }),

      completeProject: (languageId, projectId) =>
        set((state) => {
          const languageProgress = state.progress[languageId];
          return {
            languages: state.languages.map((lang) =>
              lang.id === languageId
                ? {
                    ...lang,
                    projects: lang.projects.map((proj) =>
                      proj.id === projectId
                        ? { ...proj, isCompleted: true }
                        : proj.id === getNextProjectId(proj.id, lang.projects)
                        ? { ...proj, isLocked: false }
                        : proj
                    ),
                  }
                : lang
            ),
            progress: {
              ...state.progress,
              [languageId]: {
                ...languageProgress,
                completedProjects: [...languageProgress.completedProjects, projectId],
              },
            },
          };
        }),

      updateProjectContent: (languageId, projectId, content) =>
        set((state) => ({
          languages: state.languages.map((lang) =>
            lang.id === languageId
              ? {
                  ...lang,
                  projects: lang.projects.map((proj) =>
                    proj.id === projectId
                      ? {
                          ...proj,
                          name: content.projectName,
                          description: content.projectDescription,
                          tasks: content.tasks.map((task, index) => ({
                            id: `${projectId}-task-${index}`,
                            title: task.title,
                            description: task.description,
                            isCompleted: false,
                            isLocked: index !== 0,
                          })),
                        }
                      : proj
                  ),
                }
              : lang
          ),
        })),
    }),
    {
      name: 'coding-journey-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Helper function to get the next project ID
function getNextProjectId(currentId: string, projects: Array<any>): string | null {
  const currentIndex = projects.findIndex((p) => p.id === currentId);
  return currentIndex < projects.length - 1 ? projects[currentIndex + 1].id : null;
}

export default useAppStore;
