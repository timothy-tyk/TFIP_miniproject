create database listeningroom;

use listeningroom;

create table users(
id int not null auto_increment,
name varchar(50) not null,
email varchar(50) not null,
picture varchar(150) not null,
bio text,
is_online boolean default false,
location varchar(50),
access_token text,
primary key(id)
)

create table friends(
  id int not null auto_increment,
  user_email varchar(50) not null,
  friend_email varchar(50) not null,
  primary key(id)
)

create table tokens(
id int not null auto_increment,
email varchar(50) not null,
access_token text,
primary key(id)
)

create table rooms(
  id int not null auto_increment,
  name varchar(50) not null,
  description varchar(100) not null,
  owner_email varchar(50) not null,
  user_count integer not null,
  room_id varchar(8) not null,
  active boolean default true,
  track_list text,
  track_index int not null default 0,
  track_position int not null default 0,
  primary key(id)
)