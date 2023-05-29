


# start local redis server

to start local instance on default port of 6379, leave running in another terminal
 redis-server

to access and communicate with the Redis instance:
redis-cli

see all keys in instance:
keys *

// return all values in key
GET photos 



example routes:

http://localhost:3000/albums?albumId=5
// will return all photos which belong to album 5
it will save a kv to redis as : `"photos?albumId=4"`

http://localhost:3000/photo/9
// return a single photo by id
// it will save a kv to redis as `"photos?id=9"`

http://localhost:3000/photos
// return all photos
it will save a kv to redis as `"photos"`

