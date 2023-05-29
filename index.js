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
    const photoData = await redisClient.get("photos");

    if (photoData === null) {
      const { data } = await axios.get(
        "https://jsonplaceholder.typicode.com/photos"
      );

      // set an expiration time on all our photos, data needs to be stringified to store in redis

      // can flush this data by going redis running instance and cli: flushall
      console.log("returning non-cached data");

      await redisClient.setEx("photos", 3600, JSON.stringify(data));
      response.json({ message: "returning fresh data", data });
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
      response.json({message: "returning non-cached data", data});
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
