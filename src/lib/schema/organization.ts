import { ReactElement } from 'react';

type Project = {
  name: string;
  logo: ReactElement;
};

export type Organization = {
  name: string;
  projects: Project[];
};
