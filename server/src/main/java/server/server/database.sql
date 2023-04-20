create database listeningroom;

use listeningroom;

create table users(
id int not null auto_increment,
name varchar(50) not null,
email varchar(50) not null,
picture varchar(150) not null,
primary key(id)
)

create table rooms(
  id int not null auto_increment,
  name varchar(50) not null,
  description varchar(100) not null,
  user_count integer not null,
  room_id varchar(8) not null,
  active boolean default true,
  primary key(id)
)