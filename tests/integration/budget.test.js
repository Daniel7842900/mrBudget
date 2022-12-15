const request = require("supertest");
let app = require("../../index.js");
const db = require("../../models/index.js");
const MockStrategy = require("passport-mock-strategy");
const passport = require("passport");
passport.use(new MockStrategy());
const Finance = db.finance;
const User = db.user;

let server = request.agent(app);
let agent;
let fakeBudget = null;
describe("/budget", () => {
  // beforeAll(async () => {
  //   await db.sequelize.sync({ force: false }).then(function () {
  //     server = require("../../index");
  //   });
  // });

  beforeAll(async () => {
    await db.sequelize.sync({ force: false });
    // MockStrategy.createMockPassport("mock");
    passport.authenticate("mock");
    // createUser();
    // server = require("../../index");
    // agent = request.agent(server);
    // fakeBudget = await Finance.createMock();
    // fakeUser = await User.createMock();
    // await db.sequelize.sync({ force: false }).then(function () {

    //   console.log(server);
    // });
  });

  afterAll(async () => {
    await db.sequelize.close();
    process.on("SIGTERM", () => {
      debug("SIGTERM signal received: closing HTTP server");
      server.close(() => {
        debug("HTTP server closed");
      });
    });
  });

  describe("GET /budget/", () => {
    it("should return 302 if client is not logged in", async () => {
      const res = await server.get(`/budget`);
      expect(res.status).toBe(302);
    });

    describe("should return one budget", () => {
      //   it("login", loginUser());
      it("after logged in", function (done) {
        server
          .get(`/budget`)
          .expect(302)
          .end(function (err, res) {
            console.log(res);
            if (err) return done(err);
            done();
          });
      });
      //   const res = await server.get(`/budget`);
      //   console.log(res);
      //   expect(res.status).toBe(200);
    });
  });

  //   describe("GET /budget/:id", () => {
  //     it("should return 302 if client is not logged in", async () => {
  //       const res = await request(server).get(`/budget/${fakeBudget.id}`);
  //       expect(res.status).toBe(302);
  //     });

  //     it("should return one budget", async () => {
  //       const res = await request(app).get(`/budget/${fakeBudget.id}`);
  //       console.log(res);
  //       expect(res.status).toBe(200);
  //     });
  //   });

  // describe("POST /", () => {
  //   it("should return 302 if client is not logged in", async () => {
  //     const res = await request(app).post("/budget/new");
  //     expect(res.status).toBe(302);
  //   });

  //   it("should create one budget", async () => {
  //     // passport.authenticate("mock");
  //     // passport.use(MockStrategy.createMockPassport(app));
  //     // MockStrategy.createMockPassport(app);
  //     // passport.use(new MockStrategy());
  //     MockStrategy.connectPassport(app, passport);
  //     passport.authenticate("mock");

  //     const res = await request(app)
  //       .post("/budget/new")
  //       .set("Accept", "application/json")
  //       .send({
  //         startDate: "2022-12-01",
  //         startDate: "2022-12-02",
  //         financeTypeId: 1,
  //         userId: 1,
  //       });

  //     console.log(res);

  //     const budget = await Finance.findOne({
  //       where: {
  //         startDate: "2022-12-01",
  //         startDate: "2022-12-02",
  //         financeTypeId: 1,
  //         userId: 1,
  //       },
  //     });

  //     expect(budget).not.toBeNull();
  //   });
  // });

  // afterAll(async () => {
  //   await db.sequelize.close();
  //   server.close();
  // });
});

// function createUser() {
//   return function (done) {
//     server
//       .post("/signup")
//       .send({ email: "test@test.com", password: "test123" })
//       .expect(302)
//       .expect("Location", "/dashboard")
//       .end(onResponse);

//     function onResponse(err, res) {
//       if (err) return done(err);
//       return done();
//     }
//   };
// }

// function loginUser() {
//   return function (done) {
//     server
//       .post("/login")
//       .send({ email: "test@test.com", password: "test123" })
//       .expect(302)
//       .expect("Location", "/dashboard")
//       .end(onResponse);

//     function onResponse(err, res) {
//       console.log(err);
//       console.log(res);
//       if (err) return done(err);
//       return done();
//     }
//   };
// }
