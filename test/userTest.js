// Sample test cases using Mocha and Chai
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app'); // Your app entry point

chai.use(chaiHttp);
chai.should();

describe("Users", () => {
    describe("GET /worko/user", () => {
        it("should get all users", (done) => {
            chai.request(app)
                .get('/api/worko/user')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    done();
                });
        });
    });

    // Add more tests for other endpoints
});
