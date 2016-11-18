DROP DATABASE IF EXISTS posts;
CREATE DATABASE posts;

\c posts;

CREATE TABLE postings (
  ID SERIAL PRIMARY KEY,
  postName VARCHAR,
  postContents VARCHAR
);

INSERT INTO postings (postName, postContents)
  VALUES ('First Post', 'This is my first post!');
