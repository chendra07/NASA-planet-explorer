/* eslint-disable no-undef */
const request = require("supertest");
const app = require("../../../app");
const { mongoConnect, mongoDisconnect } = require("../../../services/mongo");

describe("Launches API", () => {
  beforeAll(async () => {
    await mongoConnect();
  }, 15000);

  afterAll(async () => {
    await mongoDisconnect();
  }, 15000);

  describe("Test GET: v1/launches/all", () => {
    test("should respond 200 success", async () => {
      await request(app)
        .get("/v1/launches/all")
        .expect("Content-Type", /json/)
        .expect(200);
    }, 15000);
  });

  describe("Test POST: v1/launches/", () => {
    const completeLaunchData = {
      mission: "Morgan 115",
      rocket: "V2",
      target: "Kepler-1410 b",
      launchDate: "January 17, 2030",
    };

    const launchDataWithoutDate = {
      mission: "Morgan 115",
      rocket: "V2",
      target: "Kepler-1410 b",
    };

    const launchDataWithInvalidTarget = {
      mission: "Morgan 115",
      rocket: "V2",
      target: "Dream Land",
      launchDate: "January 17, 2030",
    };

    const launchDataWithInvalidDate = {
      mission: "Morgan 115",
      rocket: "V2",
      target: "Kepler-1410 b",
      launchDate: "Heloooooooo!",
    };

    test("should respond 201 created", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(completeLaunchData)
        .expect("Content-Type", /json/)
        .expect(201);

      const requestDate = new Date(completeLaunchData.launchDate).valueOf();
      const responseDate = new Date(response.body.data.launchDate).valueOf();

      expect(responseDate).toBe(requestDate);
      expect(response.body.data).toMatchObject(launchDataWithoutDate);
    });

    test("should catch missing required properties", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(launchDataWithoutDate)
        .expect("Content-Type", /json/)
        .expect(400);
      expect(response.body).toStrictEqual({
        message: "missing required launch property",
        statusCode: 400,
        data: null,
      });
    });

    test("should catch invalid dates", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(launchDataWithInvalidDate)
        .expect("Content-Type", /json/)
        .expect(400);
      expect(response.body).toStrictEqual({
        message: "Invalid launch date",
        statusCode: 400,
        data: null,
      });
    });

    test("should catch invalid planets", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(launchDataWithInvalidTarget)
        .expect("Content-Type", /json/)
        .expect(400);
      expect(response.body).toStrictEqual({
        message:
          "Unable to insert new launch to database | Error: No matching planets found!",
        statusCode: 400,
        data: null,
      });
    });
  });

  describe("Test Delete: v1/launches/:id", () => {
    // test("should respond 200 success", async () => {
    //   const response = await request(app)
    //     .delete("/v1/launches?id=100")
    //     .expect("Content-Type", /json/)
    //     .expect(200);
    // });

    test("should catch invalid query ID", async () => {
      await request(app)
        .delete("/v1/launches?id=wow")
        .expect("Content-Type", /json/)
        .expect(400);
    });
  });
});
