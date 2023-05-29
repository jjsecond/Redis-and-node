const getOrSetCache = async (key, redis, callback) =>{
    return new Promise(async (resolve, reject)=>{
        await redis.get(key)
    })
}