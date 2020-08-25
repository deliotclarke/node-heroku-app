const request = require('postman-request');
const locationAccess = require('./locationKey');

const geocode = (address, callback) => {
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
    address
  )}.json?access_token=${locationAccess.key}&limit=1`;
  request({ url, json: true }, (error, { body }) => {
    if (error) {
      callback('Unable to connect to location services!');
    } else if (body.message) {
      callback(body.message);
    } else if (body.features.length === 0 || body.features === undefined) {
      callback('Unable to find location. Try another search.');
    } else {
      callback(undefined, {
        longitude: body.features[0].center[0],
        latitude: body.features[0].center[1],
        location: body.features[0].place_name,
      });
    }
  });
};

module.exports = geocode;
