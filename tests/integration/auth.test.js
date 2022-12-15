// const request = require("supertest");
// let app = require("../../index.js");
// const db = require("../../models/index.js");
// const passport = require("passport");
// const http = require("node:http");
// const User = db.user;
// // const port = process.env.PORT || 3001;
// // let server;

// describe("/auth", () => {
//   describe("/login", () => {
//     beforeEach(async () => {
//       await db.sequelize.sync({ force: true });
//       server = require("../../index");
//       // await db.sequelize.sync({ force: false }).then(function () {

//       //   console.log(server);
//       // });
//     });

//     afterEach(async () => {
//       await server.close();
//     });

//     //   afterAll(async () => {
//     //     await new Promise((resolve) => setTimeout(() => resolve(), 10000)); // avoid jest open handle error
//     //   });

//     describe("POST /", () => {
//       it("should login", async (done) => {
//         const user = {
//           firstName: "first",
//           lastName: "last",
//           email: "test@test.com",
//           password: "test123",
//         };

//         await User.create(user);

//         request(server)
//           .post("/login")
//           .type("form")
//           .send({ email: "test@test.com", password: "test123" })
//           .expect(302)
//           .expect("Location", "/dashboard")
//           .end(done);
//       });
//     });
//   });
// });
