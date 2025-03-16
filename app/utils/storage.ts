import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

export interface Journey {
  language: string;
  environment: string;
  goal: string;
  level: string;
  progress: number;
  startDate: string;
}

export interface Language {
  language: string;
  level: string;
  description: string;
  progress: number;
  environment: string;
}

class Storage {
  private readonly LANGUAGES_KEY = 'languages';

  async getItem(key: string): Promise<string | null> {
    try {
      if (Platform.OS === 'web') {
        return localStorage.getItem(key);
      }
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error('Error reading from storage:', error);
      return null;
    }
  }

  async setItem(key: string, value: string): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        localStorage.setItem(key, value);
      } else {
        await AsyncStorage.setItem(key, value);
      }
    } catch (error) {
      console.error('Error writing to storage:', error);
      throw error; // Propagate error for proper error handling
    }
  }

  async getLanguages(): Promise<Language[]> {
    try {
      const data = await this.getItem(this.LANGUAGES_KEY);
      if (!data) return [];
      
      const languages = JSON.parse(data);
      if (!Array.isArray(languages)) return [];
      
      // Validate and normalize language data
      return languages.map(lang => ({
        language: lang.language || '',
        level: lang.level || '',
        description: lang.description || '',
        progress: typeof lang.progress === 'number' ? lang.progress : 0,
        environment: lang.environment || ''
      }));
    } catch (error) {
      console.error('Error getting languages:', error);
      return [];
    }
  }

  async saveLanguages(languages: Language[]): Promise<void> {
    if (!Array.isArray(languages)) {
      throw new Error('Invalid languages data');
    }

    // Remove any potential duplicates
    const uniqueLanguages = languages.reduce((acc, curr) => {
      const exists = acc.find(lang => 
        lang.language.toLowerCase() === curr.language.toLowerCase()
      );
      if (!exists) {
        acc.push(curr);
      }
      return acc;
    }, [] as Language[]);

    await this.setItem(this.LANGUAGES_KEY, JSON.stringify(uniqueLanguages));
  }

  async addLanguage(language: Language): Promise<void> {
    if (!language.language) {
      throw new Error('Language name is required');
    }

    const languages = await this.getLanguages();
    const exists = languages.some(lang => 
      lang.language.toLowerCase() === language.language.toLowerCase()
    );

    if (!exists) {
      const normalizedLanguage = {
        ...language,
        language: language.language.trim(),
        level: language.level.trim(),
        description: language.description.trim(),
        progress: typeof language.progress === 'number' ? language.progress : 0,
        environment: language.environment.trim()
      };

      await this.saveLanguages([...languages, normalizedLanguage]);
    }
  }

  async removeLanguage(languageName: string): Promise<void> {
    if (!languageName) {
      throw new Error('Language name is required for deletion');
    }

    const languages = await this.getLanguages();
    const updatedLanguages = languages.filter(lang => 
      lang.language.toLowerCase() !== languageName.toLowerCase()
    );

    await this.saveLanguages(updatedLanguages);
  }
}

export const storage = new Storage();
