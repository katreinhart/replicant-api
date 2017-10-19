const app = require('../app')
const chai = require('chai')
const expect = chai.expect
chai.use(require('chai-http'))

describe('Retirements resource', function() {
  describe('GET /bladerunners/:id/retirements', function() {
    it('should return all retirements performed by that Blade Runner', function(done) {
      chai.request(app)
        .get('/bladerunners')
        .end((err, res) => {
          expect(res.status).to.equal(200)
          expect(res.body.data).to.be.an('array')
          const bladerunner = res.body.data[0]
          const id = bladerunner.id
          chai.request(app)
            .get(`/bladerunners/${id}/retirements`)
            .end((err, res) => {
              expect(res.status).to.equal(200)
              expect(res.body.data).to.be.an('array')
              const retirement = res.body.data[0]
              const retirementId = retirement.id
              expect(retirement.replicantId).to.be.ok
              expect(retirement.bladeRunnerId).to.be.ok
              expect(retirement.retirementDate).to.be.ok
              done()
            })
        })
    })
  })

  describe('POST /bladerunners/:id/retirements', function() {
    it('should create a new retirement', function(done) {
      chai.request(app)
        .get('/bladerunners')
        .end((err, res) => {
          expect(res.status).to.equal(200)
          expect(res.body.data).to.be.an('array')
          const bladerunner = res.body.data[0]
          const id = bladerunner.id
          chai.request(app)
            .get('/replicants')
            .end((err, res) => {
              expect(res.status).to.equal(200)
              expect(res.body.data).to.be.an('array')
              const replicant = res.body.data[0]
              const replicantId = replicant.id
              const retirement = {
                bladeRunnerId: id,
                replicantId: replicantId, 
                retirementDate: '18 Oct 2017'
              }
              chai.request(app)
                .post(`/bladerunners/${id}/retirements`)
                .send(retirement) 
                .end((err, res) => {
                  expect(res.status).to.equal(200)
                  expect(res.body.data).to.be.an('object')
                  expect(res.body.data.bladeRunnerId).to.equal(id)
                  expect(res.body.data.replicantId).to.equal(replicantId)
                  expect(res.body.data.retirementDate).to.equal(retirement.retirementDate)
                  chai.request(app)
                    .get(`/replicants/${replicantId}`)
                    .end((err, res) => {
                      expect(res.status).to.equal(200)
                      expect(res.body.data).to.be.an('object')
                      expect(res.body.data.id).to.equal(replicantId)
                      expect(res.body.data.retired).to.be.true
                      expect(res.body.data.retiredBy).to.equal(id)
                      done()
                    })
                })
            })
        })
    })
  })

  describe('GET /bladerunners/:id/retirements/:retirementID', function() {
    it('should return the individual retirement data', function(done) {
      // fixture 
      const bladeRunnerId = "ee38a617-810d-4c89-b11d-69b004750fb4"
      const retirementId = "369279eb-389c-476c-80c2-ff0adfa87366"
      const retirement = {
        "id": "369279eb-389c-476c-80c2-ff0adfa87366",
        "replicantId": "75b40632-edd7-4574-8da6-0bd89a153cff",
        "bladeRunnerId": "ee38a617-810d-4c89-b11d-69b004750fb4",
        "retirementDate": "9 Nov 2049" 
      }
      chai.request(app)
        .get(`/bladerunners/${bladeRunnerId}/retirements/${retirementId}`)
        .end((err, res) => {
          expect(res.status).to.equal(200)
          expect(res.body.data).to.be.an('object')
          expect(res.body.data).to.deep.equal(retirement)
          done()
      })
    })

    it('should return 404 if information does not match', function(done) {
      chai.request(app)
        .get(`/bladerunners/999/retirements/123`)
        .end((err, res) => {
          expect(res.status).to.equal(404)
          expect(res.error.message).to.be.ok
          done()
        })
    })
  })

  describe('PUT /bladerunners/:id/retirements/:retirementID', function() {
    it('should update the given retirement', function(done) {
      // fixture 
      const bladeRunnerId = "ee38a617-810d-4c89-b11d-69b004750fb4"
      const retirementId = "369279eb-389c-476c-80c2-ff0adfa87366"
      const retirement = {
        "replicantId": "75b40632-edd7-4574-8da6-0bd89a153cff",
        "retirementDate": "19 Nov 2049" 
      }
      chai.request(app)
        .put(`/bladerunners/${bladeRunnerId}/retirements/${retirementId}`)
        .send(retirement)
        .end((err, res) => {
          expect(res.status).to.equal(200)
          expect(res.body.data).to.be.an('object')
          expect(res.body.data.bladeRunnerId).to.equal(bladeRunnerId)
          expect(res.body.data.retirementDate).to.equal(retirement.retirementDate)
          expect(res.body.data.replicantId).to.equal(retirement.replicantId)
          done()
        })
    })
  })
})