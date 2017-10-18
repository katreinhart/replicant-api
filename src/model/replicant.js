const uuid = require('uuid/v4')
const replicants = require('../../data/replicants')

function getAllReplicants() {
  return replicants
}

function getOneReplicant(id) {
  const replicant = replicants.find(rep => rep.id === id) 
  if(!replicant) return { error: { status: 404, message: 'Not found' }} 
  return replicant
}

function createReplicant(body) {
  const { name, model, serial, manufacturer, purpose, inceptDate } = body
  const id = uuid()

  const replicant = {
    id,
    name,
    model,
    serial, 
    manufacturer, 
    purpose,
    inceptDate
  }

  const errors = []

  if(!id) errors.push('Missing ID')
  if(!model) errors.push('Model is required')
  if(!serial) errors.push('Serial is required')
  if(!manufacturer) errors.push('Manufacturer is required')
  if(!inceptDate) errors.push('Incept date is required')

  if(errors.length > 0) {
    return { error: { status: 400, message: 'There were errors', errors: errors }}
  }

  replicants.push(replicant)
  return replicant
}

function updateReplicant(id, body) {
  const replicant = replicants.find(rep => rep.id === id)
  
  if(!replicant) {
    return ({ error: { status: 404, message: `Replicant ${id} not found` }})
  } 
  const { 
    name, 
    model,
    inceptDate,
    serial,
    manufacturer,
    purpose
  } = body 

  const index = replicants.indexOf(replicant)

  const errors = []
  
  if(!name)         errors.push ("Name is required")
  if(!model)        errors.push ("Model is required")
  if(!inceptDate)   errors.push ("Incept date is required")
  if(!serial)       errors.push("Serial is required")
  if(!manufacturer) errors.push("Manufacturer is required")
  if(!purpose)      errors.push("Purpose is required")

  if(errors.length > 0) {
    return ({ error: { status: 400, message: 'There were errors', errors: errors }})
  } else {
    replicant.name = name
    replicant.model = model
    replicant.inceptDate = inceptDate
    replicant.serial = serial
    replicant.manufacturer = manufacturer
    replicant.purpose = purpose
  } 
  return replicant
}

function deleteReplicant(id) {
  const replicant = replicants.find(rep => rep.id === id) 
  const index = replicants.indexOf(replicant)

  if(!replicant) {
    return ({ error: { status: 400, message: `Replicant ${id} not found` }})
  } else {
    replicants.splice(index, 1)
    return replicant
  }
}

module.exports = {
  getAllReplicants, 
  getOneReplicant,
  createReplicant,
  updateReplicant,
  deleteReplicant
}