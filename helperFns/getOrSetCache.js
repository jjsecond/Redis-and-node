const getOrSetCache = async (key, redisClient, requestDataFn) => {
    const cachedData = await redisClient.get(key);
    // returns cached data
    if (cachedData != null) {
      console.log("cache hit");
      return JSON.parse(cachedData);
    }
  
    // is a callback of the axios query
    const freshData = await requestDataFn();
  
    // set an expiration time on all our photos, data needs to be stringified to store in redis
    const defaultExpiration = 3600;
  
    // adds data to cache
    await redisClient.setEx(key, defaultExpiration, JSON.stringify(freshData));
  
    console.log("cache miss");
    // returns data from the request not the cache
    return freshData;
  };

  module.exports = getOrSetCache;

