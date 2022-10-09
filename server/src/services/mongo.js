const mongoose = require("mongoose");
const { MONGO_USERNAME, MONGO_PASSWORD } = process.env;
const MONGO_URL = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@nasacluster.s4bftgo.mongodb.net/nasa?retryWrites=true&w=majority`;

console.log("URL (2): ", MONGO_URL);

mongoose.connection.once("open", () => {
  console.log("MongoDB connection ready!");
});

mongoose.connection.on("error", (err) => {
  console.error(err);
});

async function mongoConnect() {
  mongoose.connect(MONGO_URL);
}

module.exports = {
  mongoConnect,
};
