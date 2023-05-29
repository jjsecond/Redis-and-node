const express = require("express");
const axios = require("axios");
const cors = require("cors");
const Redis = require("redis");

const app = express();
app.use(cors());

// will need to provide a prod/stage url for actually running, will need a url {url: 'some-url'}, running on default port

// need to start redis server with cli command: redis-server
const redisClient = Redis.createClient();

redisClient.connect().catch(console.error);

app.get("/photos", async (request, response) => {
  console.log("get all photos");

  try {
    console.log("here");
    const photos = await getOrSetCache("photos", redisClient, async () => {
      const { data } = await axios.get(
        "https://jsonplaceholder.typicode.com/photos"
      );

      return data;
    });

    response.json(photos);
  } catch (error) {
    response.status(500).json({ message: "Something went wrong" });
  }
});

app.get("/albums", async (request, response) => {
  console.log("get all photos");

  const albumId = request.query.albumId;

  console.log(albumId);

  try {
    const photoData = await redisClient.get(`photos?albumId=${albumId}`);

    if (photoData === null) {
      const { data } = await axios.get(
        "https://jsonplaceholder.typicode.com/photos",
        { params: { albumId } }
      );

      // set an expiration time on all our photos, data needs to be stringified to store in redis

      // can flush this data by going redis running instance and cli: flushall

      await redisClient.setEx(
        `photos?albumId=${albumId}`,
        3600,
        JSON.stringify(data)
      );
      response.json({ message: "returning non-cached data", data });
    } else {
      console.log("returning cached data");

      response.status(200).json({
        message: "Returning cached data",
        data: JSON.parse(photoData),
      });
    }
  } catch (error) {
    console.log(error);
    response.status(500).json({ message: "Something went wrong" });
  }
});

app.get("/photo/:id", async (request, response) => {
  const albumId = request.params.id;

  console.log("get album by id");
  console.log("albumId: ", albumId);
  try {
    const albumCachedData = await redisClient.get(`photos?id=${albumId}`);

    console.log(albumCachedData);

    if (albumCachedData === null) {
      const { data } = await axios.get(
        `https://jsonplaceholder.typicode.com/photos/${albumId}`
      );

      await redisClient.setEx(
        `photos?id=${albumId}`,
        3600,
        JSON.stringify(data)
      );

      response.json({ message: "returning non-cached data", data });
    } else {
      response.status(200).json({
        message: "Returning cached data",
        data: JSON.parse(albumCachedData),
      });
    }
  } catch (error) {
    console.log(error);
    response.status(500).json({ message: "Something went wrong" });
  }
});

app.listen(3000, () => {
  console.log("App is available at http://localhost:3000");
});

const getOrSetCache = async (key, redisClient, requestDataFn) => {
  console.log("hitting function");

  const cachedData = await redisClient.get(key);
  // returns cached data
  if (cachedData != null) {
    console.log("cache hit");
    return JSON.parse(cachedData);
  }

  // is a callback of the axios query
  const freshData = await requestDataFn();

  const defaultExpiration = 3600;

  // adds data to cache
  await redisClient.setEx(key, defaultExpiration, JSON.stringify(freshData));

  console.log("cache miss");
  // returns data from the request not the cache
  return freshData;
};
