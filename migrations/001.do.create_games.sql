CREATE TABLE games (
  id uuid NOT NULL,
  host TEXT NOT NULL,
  guest TEXT,
  PRIMARY KEY (id)
);