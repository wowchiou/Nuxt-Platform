import type { Tables } from '~/database/types';

export type TrelloTables = 'trello_projects' | 'trello_lists' | 'trello_tasks';

export interface TrelloLists extends Partial<Tables<'trello_lists'>> {
  trello_tasks?: Partial<Tables<'trello_tasks'>>[];
}

export interface TrelloProjects extends Partial<Tables<'trello_projects'>> {
  trello_lists?: TrelloLists[];
}

export type TrelloListsOrders = Partial<
  Omit<Tables<'trello_lists'>, 'trello_tasks'>
>;

export interface DragTaskAddData {
  toID: string;
  fromID: string;
  toIndex: number;
  fromIndex: number;
}

export interface TrelloTasksUpdateData {
  name: string;
}

export interface TrelloProjectsAddData {
  name: string;
  order: number;
  project_id: string;
}
