module.exports = {
    port: process.env.PORT || 3000,
    db: process.env.URL_MONGO || 'mongodb://node-shop:'+process.env.MONGO_ATLAS_PW+'@nodejsshop-shard-00-00-sukzd.mongodb.net:27017,nodejsshop-shard-00-01-sukzd.mongodb.net:27017,nodejsshop-shard-00-02-sukzd.mongodb.net:27017/joboffers?ssl=true&replicaSet=NodeJSShop-shard-0&authSource=admin&retryWrites=true',
    testPort: 3001,
    testDb: process.env.TEST_URL_MONGO || 'mongodb://node-shop:'+process.env.MONGO_ATLAS_PW+'@nodejsshop-shard-00-00-sukzd.mongodb.net:27017,nodejsshop-shard-00-01-sukzd.mongodb.net:27017,nodejsshop-shard-00-02-sukzd.mongodb.net:27017/joboffers-test?ssl=true&replicaSet=NodeJSShop-shard-0&authSource=admin&retryWrites=true'
};