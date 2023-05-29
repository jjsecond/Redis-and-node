const getOrSetCache = async (key, redisClient, requestDataFn) => {
  return new Promise(async (resolve, reject) => {
    await redisClient.get(key, async (error, data) => {
      // returns cached data
      if (data != null){ 
        console.log('cache hit')
        return resolve(JSON.parse(data))};

      const freshData = await requestDataFn();

      const defaultExpiration = 3600;

      // adds data to cache
      await redisClient.setEx(
        key,
        defaultExpiration,
        JSON.stringify(freshData)
      );

      console.log('cache miss')
      resolve(freshData);
    });
  });
};

