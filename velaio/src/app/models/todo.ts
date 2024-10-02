export interface TodoModel{
    id: number;
    title: string;
    completed: boolean;
    editing?: boolean;
    people?: Person[];
}

export type FilterType = 'all' | 'active' | 'completed';

export interface Person {
    id: number;
    fullName: string;
    age: number;
    skills: string[];
  }
  