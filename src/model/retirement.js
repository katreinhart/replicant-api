const retirements = require('../../data/retirements')
const { replicants } = require('./replicant')
const bladerunners = require('./bladerunner').bladerunners

const uuid = require('uuid/v4')

const getRetirements = (id) => {
  return retirements.filter(ret => ret.bladeRunnerId === id)
}

const getOneRetirement = (id, retirementId) => {
  const result = retirements.find(ret => (ret.bladeRunnerId === id && ret.id === retirementId))
  if(!result) {
    return { error: { status: 404, message: 'Retirement not found' }}
  }
  else {
    return result
  }
}

const retireReplicant = (bladeRunnerId, body) => {
  const id = uuid()

  const retirementDate = body.retirementDate
  const replicantId = body.replicantId

  const errors = []

  if(!replicantId) errors.push('Replicant ID required')
  if(!retirementDate) errors.push('Retirement date required')

  if(!replicants.find(rep => rep.id === replicantId)) errors.push('Replicant not found')

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

function updateRetirement(bladeRunnerId, retirementId, body) {
  const retirementDate = body.retirementDate
  const replicantId = body.replicantId
  const errors = []

  if(!replicantId) errors.push('Replicant ID required')
  if(!retirementDate) errors.push('Retirement Date required')

  const replicant = replicants.find(rep => rep.id === replicantId)
  if(!replicant) errors.push('Replicant not found')

  if(errors.length > 0) {
    return { error: { status: 400, message: 'There were errors', errors: errors }}
  } 

  const result = retirements.find(ret => {
    return (ret.bladeRunnerId === bladeRunnerId && ret.id === retirementId)
  })

  if(!result) {
    return { error: { status: 404, message: 'Retirement not found' }}
  } 
  else {
    result.replicantId = replicantId
    result.retirementDate = retirementDate
    replicant.retirementDate = retirementDate

    return result
  }
}

function deleteRetirement (bladeRunnerId, retirementId) {
  const retirement = retirements.find(ret => ret.id === retirementId)

  if(!retirement) return { error: { status: 404, message: "Not found" }}
  if(retirement.bladeRunnerId !== bladeRunnerId) return { error: { status: 400, message: "Not found" }}

  const index = retirements.indexOf(retirement)
  retirements.splice(index, 1)
  
  return retirement
}
 
module.exports = {
  getRetirements,
  getOneRetirement,
  retireReplicant,
  updateRetirement,
  deleteRetirement
}