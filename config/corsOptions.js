const whitelist = require("../config/allowedOrigins");

const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1 || origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS UMESH"));
    }
  },
  Credential: true,
  credentials: true,
};

module.exports = corsOptions;

// || !origin taking off at the time of deployment
