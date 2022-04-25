// Module limits repeated requests to the API and is a barrier against Hackers
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, //15 minutes
    max: 30, // Limit each IP à 30 requests per "window" / 15 mins.
    message: `BEWARE ! Too many connection attempts from this IP`  
});

module.exports = limiter;
