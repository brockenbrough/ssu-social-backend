-- Drop the app_users table if it exists
DROP TABLE IF EXISTS ssu_users;

-- Create the ssu_users table
CREATE TABLE ssu_users (
  user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(64) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(128) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  role VARCHAR(20) DEFAULT 'user',
  profile_image TEXT,
  biography VARCHAR(500)
);

-- Drop and create other empty tables
DROP TABLE IF EXISTS posts;
CREATE TABLE posts ();

DROP TABLE IF EXISTS comments;
CREATE TABLE comments ();

DROP TABLE IF EXISTS notifications;
CREATE TABLE notifications ();

DROP TABLE IF EXISTS likes;
CREATE TABLE likes ();

DROP TABLE IF EXISTS followers;
CREATE TABLE followers ();

DROP TABLE IF EXISTS chatRoom;
CREATE TABLE chatRoom ();

DROP TABLE IF EXISTS message;
CREATE TABLE message ();

DROP TABLE IF EXISTS views;
CREATE TABLE views ();

DROP TABLE IF EXISTS bookmarks;
CREATE TABLE bookmarks ();

DROP TABLE IF EXISTS contributors;
CREATE TABLE contributors ();

DROP TABLE IF EXISTS hashtags;
CREATE TABLE hashtags ();

DROP TABLE IF EXISTS post_hashtags;
CREATE TABLE post_hashtags ();
