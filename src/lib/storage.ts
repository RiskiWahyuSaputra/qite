import { ResearchProject } from '@/types';

const STORAGE_KEY = 'qite_research_projects_v1';
const SAVED_JOURNALS_KEY = 'qite_saved_journals_v1';
const SAVED_CITATIONS_KEY = 'qite_saved_citations_v1';

export function getStoredProjects(): ResearchProject[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed reading projects from localStorage:', e);
    return [];
  }
}

export function saveProjectToStorage(project: ResearchProject): void {
  if (typeof window === 'undefined') return;
  try {
    const projects = getStoredProjects();
    const existingIndex = projects.findIndex((p) => p.id === project.id);
    if (existingIndex >= 0) {
      projects[existingIndex] = project;
    } else {
      projects.unshift(project);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch (e) {
    console.error('Failed saving project to localStorage:', e);
  }
}

export function deleteProjectFromStorage(projectId: string): void {
  if (typeof window === 'undefined') return;
  try {
    const projects = getStoredProjects().filter((p) => p.id !== projectId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch (e) {
    console.error('Failed deleting project:', e);
  }
}

export function getStoredProjectById(id: string): ResearchProject | null {
  const projects = getStoredProjects();
  return projects.find((p) => p.id === id) || null;
}
