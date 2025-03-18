drop table if exists bike_favorite;

CREATE TABLE bike_favorite (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    station_id TEXT NOT NULL,
    created_at timestamp default now() not null,
    UNIQUE (user_id, station_id)
);