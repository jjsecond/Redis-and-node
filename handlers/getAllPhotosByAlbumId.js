const getOrSetCache = require('../helperFns/getOrSetCache');
const axios = require("axios");


const getAllPhotosByAlbumId = async (request, response, redisClient) => {
    console.log("get all photos belonging to an album");
  
    // can flush this data by going redis running instance and cli: flushall
  
    const albumId = request.query.albumId;
  
    console.log(typeof albumId);
  
    if (albumId === null || albumId === undefined || albumId === "") {
      response.status(401).json({ message: "Please provide album id" });
    }
  
    try {
      const photosBelongingToAlbum = await getOrSetCache(
        `photos?albumId=${albumId}`,
        redisClient,
        async () => {
          const { data } = await axios.get(
            "https://jsonplaceholder.typicode.com/photos",
            { params: { albumId } }
          );
  
          return data;
        }
      );
  
      response.json(photosBelongingToAlbum);
    } catch (error) {
      response.status(500).json({ message: "Something went wrong" });
    }
  };


  module.exports = getAllPhotosByAlbumId;