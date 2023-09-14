const { createClient } = require('redis');
// const redisClient = createClient(); //localhost
const redisClient = createClient({
	url: 'redis://192.168.137.26',
});
redisClient.connect().catch(console.error);

module.exports = redisClient;