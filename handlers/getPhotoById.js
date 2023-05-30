const getOrSetCache = require('../helperFns/getOrSetCache');
const axios = require("axios");

const getPhotoById = async (request, response, redisClient) => {
  const photoId = request.params.id;

  try {
    const photoById = await getOrSetCache(
      `photos?id=${photoId}`,
      redisClient,
      async () => {
        const { data } = await axios.get(
          `https://jsonplaceholder.typicode.com/photos/${photoId}`
        );

        return data;
      }
    );

    response.json(photoById);
  } catch (error) {
    console.log(error);
    response.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = getPhotoById;