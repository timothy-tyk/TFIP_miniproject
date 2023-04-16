create database listeningroom;

use listeningroom;

create table users(
id int not null auto_increment,
name varchar(50) not null,
email varchar(50) not null,
picture varchar(150) not null,
primary key(id)
)