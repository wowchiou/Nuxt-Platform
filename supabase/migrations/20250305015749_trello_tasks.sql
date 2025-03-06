drop table if exists trello_tasks;

CREATE TABLE trello_tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  list_id UUID NOT NULL REFERENCES trello_lists(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  "order" INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT timezone('utc', now())
);
