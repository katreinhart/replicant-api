const uuid = require('uuid/v4')
const bladerunners = require('../../data/bladerunners')

function getAllBladeRunners() {
  return bladerunners
}

function getOneBladeRunner(id) {
  const bladeRunner = bladerunners.find(br => br.id === id)
  if(bladeRunner) {
    return bladeRunner
  }
  else {
    return { error: { status: 404, message: `Blade Runner ${id} not found` }}
  }
}

function createBladeRunner(body) {
  const id = uuid()
  const { name, species, employer } = body
  const errors = []

  if(!name) errors.push('Name is required')
  if(!species) errors.push('Species is required')
  if(!employer) errors.push('Employer is required')

  const newBladeRunner = {
    id,
    name,
    species,
    employer,
    retired: []
  }

  if(errors.length > 0) {
    return { error: { message: 'There were errors', errors: errors }}
  }

  else {
    bladerunners.push(newBladeRunner)
    return newBladeRunner
  }
}

module.exports = {
  getAllBladeRunners,
  getOneBladeRunner,
  createBladeRunner
}