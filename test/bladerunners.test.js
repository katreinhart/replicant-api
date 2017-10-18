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

  describe('PUT /bladerunners/:id', function() {
    it('should update an individual Blade Runner', function(done) {
      chai.request(app)
        .get('/bladerunners')
        .end((err, res) => {
          expect(res.status).to.equal(200)
          expect(res.body.data).to.be.an('array')
          const bladeRunner = res.body.data[0]
          const id = bladeRunner.id
          const newData = {
            ...bladeRunner,
            "name": "Joe"
          }
          chai.request(app)
            .put(`/bladerunners/${id}`)
            .send(newData)
            .end((err, res) => {
              expect(res.status).to.equal(200)
              expect(res.body.data).to.be.an('object')
              expect(res.body.data.name).to.equal("Joe")
              expect(res.body.data.employer).to.equal("LAPD")
              done()
            })
        })
    })

    it('should return an error if ID is not found', function(done) {
      chai.request(app)
        .put('/bladerunners/999')
        .send({})
        .end((err, res) => {
          expect(res.status).to.equal(404)
          expect(res.body.error.message).to.be.ok
          expect(res.body.error.message).to.equal('Blade Runner 999 not found')
          done()
        })
    })

    it('should not update if information is missing', function(done) {
      chai.request(app)
        .get('/bladerunners')
        .end((err, res) => {
          expect(res.status).to.equal(200)
          expect(res.body.data).to.be.an('array')
          const bladeRunner = res.body.data[0]
          const id = bladeRunner.id
          const data = {}
          chai.request(app)
            .put(`/bladerunners/${id}`)
            .send(data)
            .end((err, res) => {
              expect(res.status).to.equal(400)
              expect(res.body.error.message).to.be.ok
              expect(res.body.error.errors).to.be.an('array')
              expect(res.body.error.errors).to.include('Name is required')
              expect(res.body.error.errors).to.include('Employer is required')
              expect(res.body.error.errors).to.include('Species is required')
              done()
            })
        })
    })
  })

  describe('DELETE /bladerunners/:id', function() {
    it('should delete a Blade Runner if given a valid ID', function(done) {
      chai.request(app)
        .get('/bladerunners')
        .end((err, res) => {
          expect(res.status).to.equal(200)
          expect(res.body.data).to.be.an('array')
          const numberOfBladeRunners = res.body.data.length
          const bladeRunner = res.body.data[0]
          const id = bladeRunner.id
          chai.request(app)
            .delete(`/bladerunners/${id}`)
            .end((err, res) => {
              expect(res.status).to.equal(200)
              expect(res.body.data).to.be.an('object')
              chai.request(app)
                .get('/bladerunners')
                .end((err, res) => {
                  expect(res.status).to.equal(200)
                  expect(res.body.data).to.be.an('array')
                  expect(res.body.data.length).to.equal(numberOfBladeRunners - 1)
                  done()
                })
            }) 
        })
    })

    it('should return an error if ID is not found', function(done) {
      chai.request(app)
        .delete('/bladerunners/999')
        .end((err, res) => {
          expect(res.status).to.equal(404)
          expect(res.body.error.message).to.be.ok
          done()
        })
    })
  })
})