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
                  console.log('testing the posting fo the retirement')
                  expect(res.status).to.equal(200)
                  expect(res.body.data).to.be.an('object')
                  expect(res.body.data.bladeRunnerId).to.equal(id)
                  expect(res.body.data.replicantId).to.equal(replicantId)
                  expect(res.body.data.retirementDate).to.equal(retirement.retirementDate)
                  chai.request(app)
                    .get(`/replicants/${replicantId}`)
                    .end((err, res) => {
                      console.log('testing to make sure the replicant was updatedd')
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
})