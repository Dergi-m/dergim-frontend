'use client';

import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

import { ProjectInvitation, ProjectSummary, SessionUser } from '@/lib/schema/session-user';
import { trpc } from '@/server/api/react';

type SessionContextType = {
  sessionUser: SessionUser;
  setSessionUser: (session: SessionUser) => void;
  activeProject?: ProjectSummary;
  setActiveProject: (project: ProjectSummary) => void;
  projects: ProjectSummary[];
  addProject: (project: ProjectSummary) => void;
  removeProject: (projectId: string) => void;
  invitations: ProjectInvitation[];
  acceptInvitation: (invitationId: string) => void;
  rejectInvitation: (invitationId: string) => void;
};

type SessionProviderProps = {
  session: SessionUser;
  children?: ReactNode;
};

const SessionContext = createContext<SessionContextType | null>(null);

export function SessionProvider({ children, session }: SessionProviderProps) {
  const [sessionUser, setSessionUser] = useState<SessionUser>(session);
  const [projects, setProjects] = useState<ProjectSummary[]>(session.projects ?? []);
  const [invitations, setInvitations] = useState<ProjectInvitation[]>(
    session.projectInvitations ?? []
  );
  const [activeProject, setActiveProject] = useState<ProjectSummary>();

  const addProject = (project: ProjectSummary) => {
    setProjects((prevProjects) => [...prevProjects, project]);
  };

  const removeProject = (projectId: string) => {
    setProjects((prevProjects) => prevProjects.filter((p) => p.id !== projectId));
  };

  const acceptInvitation = (invitationId: string) => {
    const invitation = invitations.find((i) => i.id === invitationId);
    if (!invitation) return;

    setInvitations((prevInvitations) => prevInvitations.filter((i) => i.id !== invitationId));
  };

  const rejectInvitation = (invitationId: string) => {
    const invitation = invitations.find((i) => i.id === invitationId);
    if (!invitation) return;

    setInvitations((prevInvitations) => prevInvitations.filter((i) => i.id !== invitationId));
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
        invitations,
        acceptInvitation,
        rejectInvitation,
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
  const {
    sessionUser,
    setActiveProject,
    activeProject,
    addProject,
    projects,
    removeProject,
    invitations,
    rejectInvitation,
    acceptInvitation,
  } = context;

  const userTasks = trpc.page.dashboard.getUserTasks.useQuery({
    userId: context.sessionUser.id,
  });

  return {
    sessionUser,
    activeProject,
    setActiveProject,
    projects,
    addProject,
    removeProject,
    invitations,
    acceptInvitation,
    rejectInvitation,
    userTasks,
  } as const;
}
