// import { collection, doc, getDoc, getDocs, setDoc, updateDoc, query, where, orderBy, DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
// import { db } from './config';
// import type { Language, Project, Task, UserProgress, AIGeneratedContent } from '../../types/models';

// export class FirebaseDatabase {
//   // Languages
//   async getLanguages(): Promise<Language[]> {
//     const languagesRef = collection(db, 'languages');
//     const snapshot = await getDocs(languagesRef);
//     return snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => 
//       ({ id: doc.id, ...doc.data() } as Language)
//     );
//   }

//   async getLanguage(id: string): Promise<Language | null> {
//     const docRef = doc(db, 'languages', id);
//     const docSnap = await getDoc(docRef);
//     return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as Language : null;
//   }

//   // Projects
//   async getProjects(languageId: string): Promise<Project[]> {
//     const projectsRef = collection(db, 'projects');
//     const q = query(
//       projectsRef,
//       where('languageId', '==', languageId),
//       orderBy('order')
//     );
//     const snapshot = await getDocs(q);
//     return snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => 
//       ({ id: doc.id, ...doc.data() } as Project)
//     );
//   }

//   async getProject(id: string): Promise<Project | null> {
//     const docRef = doc(db, 'projects', id);
//     const docSnap = await getDoc(docRef);
//     return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as Project : null;
//   }

//   // Tasks
//   async getTasks(projectId: string): Promise<Task[]> {
//     const tasksRef = collection(db, 'tasks');
//     const q = query(
//       tasksRef,
//       where('projectId', '==', projectId),
//       orderBy('order')
//     );
//     const snapshot = await getDocs(q);
//     return snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => 
//       ({ id: doc.id, ...doc.data() } as Task)
//     );
//   }

//   // User Progress
//   async getUserProgress(userId: string, languageId: string): Promise<UserProgress | null> {
//     const progressRef = doc(db, 'userProgress', `${userId}_${languageId}`);
//     const docSnap = await getDoc(progressRef);
//     if (!docSnap.exists()) return null;
//     const data = docSnap.data();
//     return {
//       id: docSnap.id,
//       userId: data.userId,
//       languageId: data.languageId,
//       projectId: data.projectId,
//       completedTasks: data.completedTasks,
//       lastUpdated: data.lastUpdated.toDate()
//     } as UserProgress;
//   }

//   async updateUserProgress(progress: UserProgress): Promise<void> {
//     const progressRef = doc(db, 'userProgress', `${progress.userId}_${progress.languageId}`);
//     await setDoc(progressRef, {
//       ...progress,
//       lastUpdated: new Date()
//     });
//   }

//   // AI Generated Content
//   async saveGeneratedContent(content: AIGeneratedContent): Promise<void> {
//     const contentRef = doc(db, 'aiContent', content.languageId);
//     await setDoc(contentRef, {
//       ...content,
//       generatedAt: new Date()
//     });
//   }

//   async getGeneratedContent(languageId: string): Promise<AIGeneratedContent | null> {
//     const contentRef = doc(db, 'aiContent', languageId);
//     const docSnap = await getDoc(contentRef);
//     if (!docSnap.exists()) return null;
//     const data = docSnap.data();
//     return {
//       id: docSnap.id,
//       languageId: data.languageId,
//       projects: data.projects,
//       generatedAt: data.generatedAt.toDate()
//     } as AIGeneratedContent;
//   }
// }

// export const firebaseDB = new FirebaseDatabase(); 