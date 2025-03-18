import { Task } from '../../types';
import { backendAPI } from '../api/backend';

export async function generateTaskHelp(task: Task, languageId: string): Promise<string> {
  try {
    return await backendAPI.generateTaskHelp(task.id, languageId);
  } catch (error) {
    console.error('Error generating help:', error);
    throw error;
  }
} 