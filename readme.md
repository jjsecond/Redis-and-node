# What is this repo

A quick example how to use a redis server locally with a node api for caching responses from another api.



# start local redis server

- to start local instance on default port of 6379, leave running in another terminal
 `redis-server`

- to access and communicate with the Redis instance:
`redis-cli`


## Useful Redis cli commands
- see all keys in instance:
`keys *`

- return all values in key
`GET <keyname>` 

- flush the cache:
`flushall`


- start the api:
`npm i`
`npm run start`


## example routes:

### will return all photos which belong to album 5

endpoint: `http://localhost:3000/albums?albumId=5`
it will save a kv to redis as : `"photos?albumId=4"`

### return a single photo by id

endpoint: `http://localhost:3000/photo/9`
it will save a kv to redis as `"photos?id=9"`

### return all photos

endpoint: `http://localhost:3000/photos`
it will save a kv to redis as `"photos"`


## Useful tutorials

1. What is redis: `https://www.youtube.com/watch?v=64VG179N4no&list=PLS1QulWo1RIYZZxQdap7Sd0ARKFI-XVsd`

2. How to work with redis and what this project is based on: `https://www.youtube.com/watch?v=jgpVdJB2sKQ`


