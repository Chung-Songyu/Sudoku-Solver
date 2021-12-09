const chai = require("chai");
const assert = chai.assert;
const chaiHttp = require('chai-http');
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {
  // #1
  test('Solve a puzzle with valid puzzle string', (done) => {
    chai
    .request(server)
    .post("/api/solve")
    .send({
      puzzle: ".4....76..8..9.2..531..6...6...71........2..89.4...5...1.45.......3..924..7..8..3"
    })
    .end((err, res) => {
      assert.equal(res.status, 200);
      assert.equal(res.type, "application/json");
      assert.equal(res.body.solution, "249835761786194235531726489658971342173542698924683517312459876865317924497268153");
      done();
    });
  });

  // #2
  test('Solve a puzzle with missing puzzle string', (done) => {
    chai
    .request(server)
    .post("/api/solve")
    .send({
      puzzle: null
    })
    .end((err, res) => {
      assert.equal(res.status, 200);
      assert.equal(res.type, "application/json");
      assert.equal(res.body.error, "Required field missing");
      done();
    });
  });

  // #3
  test('Solve a puzzle with invalid characters', (done) => {
    chai
    .request(server)
    .post("/api/solve")
    .send({
      puzzle: "Z4....76..8..9.2..531..6...6...71........2..89.4...5...1.45.......3..924..7..8..3"
    })
    .end((err, res) => {
      assert.equal(res.status, 200);
      assert.equal(res.type, "application/json");
      assert.equal(res.body.error, "Invalid characters in puzzle");
      done();
    });
  });

  // #4
  test('Solve a puzzle with incorrect length', (done) => {
    chai
    .request(server)
    .post("/api/solve")
    .send({
      puzzle: "4....76..8..9.2..531..6...6...71........2..89.4...5...1.45.......3..924..7..8..3"
    })
    .end((err, res) => {
      assert.equal(res.status, 200);
      assert.equal(res.type, "application/json");
      assert.equal(res.body.error, "Expected puzzle to be 81 characters long");
      done();
    });
  });

  // #5
  test('Solve a puzzle that cannot be solved', (done) => {
    chai
    .request(server)
    .post("/api/solve")
    .send({
      puzzle: "44....76..8..9.2..531..6...6...71........2..89.4...5...1.45.......3..924..7..8..3"
    })
    .end((err, res) => {
      assert.equal(res.status, 200);
      assert.equal(res.type, "application/json");
      assert.equal(res.body.error, "Puzzle cannot be solved");
      done();
    });
  });

  // #6
  test('Check a puzzle placement with all fields', (done) => {
    chai
    .request(server)
    .post("/api/check")
    .send({
      puzzle: ".4....76..8..9.2..531..6...6...71........2..89.4...5...1.45.......3..924..7..8..3",
      coordinate: "A1",
      value: 2
    })
    .end((err, res) => {
      assert.equal(res.status, 200);
      assert.equal(res.type, "application/json");
      assert.equal(res.body.valid, true);
      done();
    });
  });

  // #7
  test('Check a puzzle placement with single placement conflict', (done) => {
    chai
    .request(server)
    .post("/api/check")
    .send({
      puzzle: ".4....76..8..9.2..531..6...6...71........2..89.4...5...1.45.......3..924..7..8..3",
      coordinate: "A1",
      value: 7
    })
    .end((err, res) => {
      assert.equal(res.status, 200);
      assert.equal(res.type, "application/json");
      assert.equal(res.body.valid, false);
      assert.deepEqual(res.body.conflict, ["row"]);
      done();
    });
  });

  // #8
  test('Check a puzzle placement with multiple placement conflicts', (done) => {
    chai
    .request(server)
    .post("/api/check")
    .send({
      puzzle: ".4....76..8..9.2..531..6...6...71........2..89.4...5...1.45.......3..924..7..8..3",
      coordinate: "A1",
      value: 6
    })
    .end((err, res) => {
      assert.equal(res.status, 200);
      assert.equal(res.type, "application/json");
      assert.equal(res.body.valid, false);
      assert.deepEqual(res.body.conflict, ["row", "column"]);
      done();
    });
  });

  // #9
  test('Check a puzzle placement with all placement conflicts', (done) => {
    chai
    .request(server)
    .post("/api/check")
    .send({
      puzzle: ".4....76..8..9.2..531..6...6...71........2..89.4...5...1.45.......3..924..7..8..3",
      coordinate: "I4",
      value: 3
    })
    .end((err, res) => {
      assert.equal(res.status, 200);
      assert.equal(res.type, "application/json");
      assert.equal(res.body.valid, false);
      assert.deepEqual(res.body.conflict, ["row", "column", "region"]);
      done();
    });
  });

  // #10
  test('Check a puzzle placement with missing required fields', (done) => {
    chai
    .request(server)
    .post("/api/check")
    .send({
      value: 3
    })
    .end((err, res) => {
      assert.equal(res.status, 200);
      assert.equal(res.type, "application/json");
      assert.equal(res.body.error, "Required field(s) missing");
      done();
    });
  });

  // #11
  test('Check a puzzle placement with invalid characters', (done) => {
    chai
    .request(server)
    .post("/api/check")
    .send({
      puzzle: "Z4....76..8..9.2..531..6...6...71........2..89.4...5...1.45.......3..924..7..8..3",
      coordinate: "A1",
      value: 2
    })
    .end((err, res) => {
      assert.equal(res.status, 200);
      assert.equal(res.type, "application/json");
      assert.equal(res.body.error, "Invalid characters in puzzle");
      done();
    });
  });

  // #12
  test('Check a puzzle placement with incorrect length', (done) => {
    chai
    .request(server)
    .post("/api/check")
    .send({
      puzzle: "4....76..8..9.2..531..6...6...71........2..89.4...5...1.45.......3..924..7..8..3",
      coordinate: "A1",
      value: 2
    })
    .end((err, res) => {
      assert.equal(res.status, 200);
      assert.equal(res.type, "application/json");
      assert.equal(res.body.error, "Expected puzzle to be 81 characters long");
      done();
    });
  });

  // #13
  test('Check a puzzle placement with invalid placement coordinate', (done) => {
    chai
    .request(server)
    .post("/api/check")
    .send({
      puzzle: ".4....76..8..9.2..531..6...6...71........2..89.4...5...1.45.......3..924..7..8..3",
      coordinate: "Z1",
      value: 2
    })
    .end((err, res) => {
      assert.equal(res.status, 200);
      assert.equal(res.type, "application/json");
      assert.equal(res.body.error, "Invalid coordinate");
      done();
    });
  });

  // #14
  test('Check a puzzle placement with invalid placement value', (done) => {
    chai
    .request(server)
    .post("/api/check")
    .send({
      puzzle: ".4....76..8..9.2..531..6...6...71........2..89.4...5...1.45.......3..924..7..8..3",
      coordinate: "A1",
      value: 99
    })
    .end((err, res) => {
      assert.equal(res.status, 200);
      assert.equal(res.type, "application/json");
      assert.equal(res.body.error, "Invalid value");
      done();
    });
  });
});
