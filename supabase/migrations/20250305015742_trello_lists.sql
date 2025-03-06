drop table if exists trello_lists;

CREATE TABLE trello_lists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES trello_projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  "order" INT NOT NULL DEFAULT 0,
  created_at timestamp default now() not null
);