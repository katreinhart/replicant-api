const app = require('../app')
const chai = require('chai')
const expect = chai.expect

chai.use(require('chai-http'))

describe('Replicants Resource', function(){
  describe('POST /replicant', function(){
    it('should create a new replicant', function(done){
      const replicant = { 
        name: 'Roy Batty', 
        model: 'Nexus 6', 
        serial: 'N6MAA10816', 
        manufacturer: 'Tyrell Corp.', 
        inceptDate: '8 Jan 2016', 
        purpose: 'Military' 
      }

      chai.request(app)
        .post('/replicants')
        .send(replicant)
        .end((err, res) => {
          expect(res.status).to.equal(201)
          expect(res.body).to.be.an('object')
          expect(res.body.id).to.be.ok
          expect(res.body.name).to.equal(replicant.name)
          expect(res.body.model).to.equal(replicant.model)
          expect(res.body.serial).to.equal(replicant.serial)
          expect(res.body.manufacturer).to.equal(replicant.manufacturer)
          expect(res.body.inceptDate).to.equal(replicant.inceptDate)
          done()
        })
    })
    it('should throw an error for missing model', function(done) {
      const replicant = { 
        name: 'Pris', 
        serial: 'N6FAB21416', 
        manufacturer: 'Tyrell Corp.', 
        inceptDate: '14 February 2016' 
      }
      chai.request(app)
        .post('/replicants')
        .send(replicant)
        .end((err, res) => {
          expect(res.status).to.equal(400)
          expect(res.body).to.be.an('object')
          expect(res.body.message).to.be.ok
          expect(res.body.errors).to.include('Model is required')
          done()
        })
    })
    it('should throw an error for missing incept date', function(done) {
      const replicant = {
        name: 'Rachel',
        serial: '', 
        model: 'Nexus 7', 
        manufacturer: 'Tyrell Corp.'
      }
      chai.request(app)
        .post('/replicants')
        .send(replicant)
        .end((err, res) => {
          expect(res.status).to.equal(400)
          expect(res.body).to.be.an('object')
          expect(res.body.message).to.be.ok
          expect(res.body.errors).to.include('Incept date is required')
          done()
        })
    })
  })

  describe('GET /replicant', function() {
    it('should retrieve a list of all replicants if no parameters are included', function(done) {
      chai.request(app)
        .get('/replicants')
        .end((err, res) => {
          expect(res.status).to.equal(200)
          expect(res.body.data).to.be.an('array')
          
          const replicant = res.body.data[0]
          expect(replicant).to.be.an('object')
          expect(replicant.name).to.be.ok
          done()
        })
    })
  })

  describe('GET /replicant/:id', function() {
    it('should return the specified replicant', function(done) {
      chai.request(app)
        .get('/replicants')
        .end((err, res) => {
          expect(res.status).to.equal(200)
          expect(res.body.data).to.be.an('array')
          
          const replicant = res.body.data[0]
          const id = replicant.id
          chai.request(app)
            .get(`/replicants/${id}`)
            .end((err, res) => {
              expect(res.status).to.equal(200)
              expect(res.body.data).to.be.an('object')
              expect(res.body.data.name).to.equal(replicant.name)
              expect(res.body.data.inceptDate).to.equal(replicant.inceptDate)
              done()
            })
        })
    }) 
    it('should return an error if there is not a matching ID', function(done) {
      chai.request(app)
        .get('/replicants/999')
        .end((err, res) => {
          expect(res.status).to.equal(404)
          expect(res.body.error.message).to.be.ok
          done()
        })
    })
  })

  describe('PUT /replicants/:id', function() {
    it('should update a replicant if all parameters are provided', function(done) {
      const newReplicant = {
        name: 'Luv', 
        model: 'Nexus 7',
        serial: 'K38N0816',
        purpose: 'Secretary/Enforcer',
        manufacturer: 'Niander Wallace', 
        inceptDate: '08 August 2035',
        retired: true,
        retiredBy: 'ee38a617-810d-4c89-b11d-69b004750fb4'
      }
      chai.request(app)
        .get('/replicants')
        .end((err, res) => {
          expect(res.status).to.equal(200)
          expect(res.body.data).to.be.an('array')
          const replicant = res.body.data[0]
          const id = replicant.id
          chai.request(app) 
            .put(`/replicants/${id}`)
            .send(newReplicant)
            .end((err, res) => {
              expect(res.status).to.equal(200)
              expect(res.body.data).to.be.an('object')
              expect(res.body.data.name).to.equal(newReplicant.name)
              expect(res.body.data.serial).to.equal(newReplicant.serial)
              expect(res.body.data.inceptDate).to.equal(newReplicant.inceptDate)
              done()
            })
        })
        
    })
    it('should not update if ID does not match', function(done) {
      chai.request(app)
        .put('/replicants/1234')
        .send({})
        .end((err, res) => {
          expect(res.status).to.equal(404)
          expect(res.body).to.be.an('object')
          expect(res.body.error.message).to.be.ok
          done()
        })
    })
    it('should not update if missing information', function(done) {
      chai.request(app)
        .get('/replicants')
        .end((err, res) => {
          expect(res.status).to.equal(200)
          expect(res.body.data).to.be.an('array')
          const replicant = res.body.data[0]
          const id = replicant.id
          chai.request(app)
            .put(`/replicants/${id}`)
            .send({})
            .end((err, res) => {
              expect(res.status).to.equal(400)
              expect(res.body).to.be.an('object')
              expect(res.body.error.message).to.equal('There were errors')
              expect(res.body.error.errors).to.include('Name is required')
              done()
            })
        })
    })
  })

  describe('DELETE /replicants/:id', function () {
    it('should delete a replicant if matching ID is found', function(done) {
      chai.request(app)
        .get('/replicants')
        .end((err, res) => {
          expect(res.status).to.equal(200)
          expect(res.body.data).to.be.an('array')
          const beforeLength = res.body.data.length
          const replicant = res.body.data[0]
          const id = replicant.id
          chai.request(app)
            .delete(`/replicants/${id}`)
            .end((err, res) => {
              expect(res.status).to.equal(200)
              expect(res.body.data).to.be.an('object')
              expect(res.body.data.name).to.equal(replicant.name)
              chai.request(app)
                .get('/replicants')
                .end((err, res) => {
                  expect(res.status).to.equal(200)
                  expect(res.body.data).to.be.an('array')
                  expect(res.body.data.length).to.equal(beforeLength - 1)
                  expect(res.body.data.indexOf(replicant)).to.equal(-1)
                  done()
                })
            })
        })
    })

    it('should return an error if ID is not found', function(done) {
      chai.request(app)
        .delete('/replicants/999')
        .end((err, res) => {
          expect(res.status).to.equal(404)
          expect(res.body.error.message).to.be.ok
          done()
        })
    })
  })
})
