const getOrSetCache = require('../helperFns/getOrSetCache');
const axios = require("axios");


const getAllAlbumsHandler = async (request, response, redisClient) => {
    // this function will return all photos
    try {
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
  }


  module.exports = getAllAlbumsHandler;