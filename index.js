const express = require("express");
const cors = require("cors");
const Redis = require("redis");
const getOrSetCache = require("./helperFns/getOrSetCache");
const getAllAlbumsHandler = require("./handlers/getAllAlbumsHandler.js");
const getAllPhotosByAlbumId = require("./handlers/getAllPhotosByAlbumId");
const getPhotoById = require("./handlers/getPhotoById");
const axios = require("axios");

const app = express();
app.use(cors());

// will need to provide a prod/stage url for actually running, will need a url {url: 'some-url'}, running on default port

// need to start redis server with cli command: redis-server
const redisClient = Redis.createClient();

redisClient.connect().catch(console.error);

// this route will return all photos and save them to cache if the cache is empty
app.get("/photos", (req, res) => {
  getAllAlbumsHandler(req, res, redisClient);
});


// many photos can belong to one album
app.get("/albums", (req, res) => {
  getAllPhotosByAlbumId(req, res, redisClient);
});

// get an individual photo by id
app.get("/photo/:id", async (req, res) => {
  getPhotoById(req, res, redisClient);
});

app.listen(3000, () => {
  console.log("App is available at http://localhost:3000");
});
