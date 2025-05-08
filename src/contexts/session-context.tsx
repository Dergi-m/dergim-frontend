'use client';

import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

import { ProjectSummary, SessionUser } from '@/lib/schema/session-user';

type SessionContextType = {
  sessionUser: SessionUser;
  setSessionUser: (session: SessionUser) => void;
  activeProject?: ProjectSummary;
  setActiveProject: (project: ProjectSummary) => void;
  projects: ProjectSummary[];
  addProject: (project: ProjectSummary) => void;
  removeProject: (projectId: string) => void;
};

type SessionProviderProps = {
  session: SessionUser;
  children?: ReactNode;
};

const SessionContext = createContext<SessionContextType | null>(null);

export function SessionProvider({ children, session }: SessionProviderProps) {
  const [sessionUser, setSessionUser] = useState<SessionUser>(session);
  const [projects, setProjects] = useState<ProjectSummary[]>(session.projects ?? []);
  const [activeProject, setActiveProject] = useState<ProjectSummary>();

  const addProject = (project: ProjectSummary) => {
    setProjects((prevProjects) => [...prevProjects, project]);
  };

  const removeProject = (projectId: string) => {
    setProjects((prevProjects) => prevProjects.filter((p) => p.id !== projectId));
  };

  useEffect(() => {
    const projects = sessionUser.projects ?? [];
    const currentProjectName = localStorage.getItem('activeProject');

    if (!activeProject) {
      const currentProject = currentProjectName
        ? projects.find((project) => project.name === currentProjectName)
        : projects[0];
      setActiveProject(currentProject);
    }

    if (currentProjectName !== activeProject?.name) {
      localStorage.setItem('activeProject', activeProject?.name ?? '');
    }
  }, [activeProject, sessionUser.projects]);

  return (
    <SessionContext.Provider
      value={{
        sessionUser,
        setSessionUser,
        activeProject,
        setActiveProject,
        addProject,
        projects,
        removeProject,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

/**
 * Custom hook to access the ApplicationContext.
 * This hook should be used within a ApplicationProvider.
 *
 * @returns {SessionContextType} The current context value.
 * If the context is `null`, this indicates that the hook is being used outside of a ApplicationProvider, and an error will be thrown.
 *
 * @throws {Error} If the hook is used outside of a ApplicationProvider.
 */

export function useSession() {
  const context = useContext(SessionContext);

  if (context == null) {
    throw new Error('useSession must be used within a SessionProvider');
  }

  const { sessionUser, setActiveProject, activeProject, addProject, projects, removeProject } =
    context;

  return {
    sessionUser,
    activeProject,
    setActiveProject,
    projects,
    addProject,
    removeProject,
  } as const;
}
