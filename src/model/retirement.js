const retirements = require('../../data/retirements')
const replicants = require('./replicant').replicants
const bladerunners = require('./bladerunner').bladerunners

const uuid = require('uuid/v4')

const getRetirements = (id) => {
  const retirementsById = retirements.filter(ret => ret.bladeRunnerId === id)
  return retirementsById
}

const retireReplicant = (bladeRunnerId, body) => {
  const id = uuid()

  const retirementDate = body.retirementDate
  const replicantId = body.replicantId

  const errors = []

  if(!replicantId) errors.push('Replicant ID required')
  if(!retirementDate) errors.push('Retirement date required')

  if(errors.length > 0) {
    return { error: { status: 400, message: 'There were errors', errors: errors }}
  }

  const retirement = {
    id,
    replicantId,
    bladeRunnerId,
    retirementDate
  }

  const replicant = replicants.find(rep => rep.id === replicantId)
  replicant.retired = true
  replicant.retiredBy = bladeRunnerId

  const bladerunner = bladerunners.find(br => br.id === bladeRunnerId)
  bladerunner.retired.push(replicantId)
  
  return retirement
}

module.exports = {
  getRetirements,
  retireReplicant
}