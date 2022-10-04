const { parse } = require("csv-parse");
const path = require("path");
const fs = require("fs");

const habitablePlanet = [];

function isHabitablePlanet(planet) {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.11 &&
    planet["koi_prad"] < 1.6
  );
}

function loadPlanetsData() {
  return new Promise((resolve, reject) => {
    fs.createReadStream(path.join(__dirname, "../../data", "kepler_data.csv"))
      .pipe(
        parse({
          comment: "#",
          columns: true,
        })
      ) //connecting source and destination file
      .on("data", (data) => {
        if (isHabitablePlanet(data)) {
          habitablePlanet.push(data);
        }
      })
      .on("error", (error) => {
        console.log("(fs) error: ", error);
        reject(error);
      })
      .on("end", () => {
        console.log(
          habitablePlanet.map((planet) => {
            return planet["kepler_name"];
          })
        );
        console.log(`${habitablePlanet.length} habitable planets found`);
        resolve();
      });
  });
}

function getAllPlanets() {
  return habitablePlanet;
}

module.exports = {
  loadPlanetsData,
  getAllPlanets,
};
