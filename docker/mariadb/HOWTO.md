docker-compose up -d
docker exec -it [dockerid] bash
myslq -u root -p

create database fastify;

grant all privileges on fastify.\* TO 'fastify'@'%' identified by 'FASTIFYCANDY!';

flush privileges;
