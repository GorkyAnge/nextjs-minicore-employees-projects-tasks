export interface Employee {
  id: string;
  name: string;
  surname: string;
}

export interface Project {
  id: string;
  name: string;
}

export interface Task {
  id: number;
  description: string;
  start_date: string;
  stimated_days: number;
  state: number;
  employee: string;
  project: string;
}