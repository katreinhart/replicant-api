const app = require('../app')
const chai = require('chai')
const expect = chai.expect

chai.use(require('chai-http'))

describe('Blade Runners Resource', function() {
  describe('POST /bladerunners', function() {
    it('should add a new Blade Runner', function (done) {
      const bladerunner = {
        name: 'Gaff',
        species: 'Human',
        employer: 'LAPD'
      }
      chai.request(app)
        .post('/bladerunners')
        .send(bladerunner)
        .end((err, res) => {
          expect(res.status).to.equal(200)
          expect(res.body).to.be.an('object')
          expect(res.body.data.name).to.equal(bladerunner.name)
          expect(res.body.data.employer).to.equal(bladerunner.employer)
          expect(res.body.data.retired.length).to.equal(0)
          done()
        })
    })
    it('should return an error if name is missing', function(done) {
      const bladerunner = {
        species: "replicant",
        employer: "LAPD"
      }
      chai.request(app)
        .post('/bladerunners')
        .send(bladerunner)
        .end((err, res) => {
          expect(res.status).to.equal(400)
          expect(res.body).to.be.an('object')
          expect(res.body.error.message).to.be.ok
          expect(res.body.error.errors).to.include('Name is required')
          done()
        })
    })
  })

  describe('GET /bladerunners/', function() {
    it('should return an array of all Blade Runners', function(done) {
      chai.request(app) 
        .get('/bladerunners')
        .end((err, res) => {
          expect(res.status).to.equal(200)
          expect(res.body.data).to.be.an('array')
          const bladeRunner = res.body.data[0]
          expect(bladeRunner.name).to.be.ok
          expect(bladeRunner.employer).to.be.ok
          done()
        })
    })
  })

  describe('GET /bladerunners/:id', function() {
    it('should return an individual Blade Runner', function(done) {
      chai.request(app)
        .get('/bladerunners')
        .end((err, res) => {
          expect(res.status).to.equal(200)
          expect(res.body.data).to.be.an('array')
          const bladeRunner = res.body.data[0]
          const id = bladeRunner.id
          chai.request(app)
            .get(`/bladerunners/${id}`)
            .end((err, res) => {
              expect(res.status).to.equal(200)
              expect(res.body.data).to.be.an('object')
              expect(res.body.data.name).to.equal(bladeRunner.name)
              expect(res.body.data.employer).to.equal(bladeRunner.employer)
              done()
            })
        })
    })
  })
})