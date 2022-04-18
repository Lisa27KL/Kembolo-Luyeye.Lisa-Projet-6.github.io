// Module limits repeated requests to the API and is a barrier against Hackers
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, //15 minutes
    max: 30, // Limit each IP à 30 requests per "window" / 15 mins.
    message: `BEAWARE ! Too many connection attempts`  
});

module.exports = limiter;
