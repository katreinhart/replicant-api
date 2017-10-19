const uuid = require('uuid/v4')
const model = require('../model/retirement')

const getRetirements = (req, res, next) => {
  const response = model.getRetirements(req.params.id)
  res.status(200).json({ data: response })
}

const getOneRetirement = (req, res, next) => {
  const { id, retirementId } = req.params
  const response = model.getOneRetirement(id, retirementId)

  if(response.error) {
    res.status(404).json({ error: response.error })
  } 
  else {
    res.status(200).json({ data: response })  
  }
  
}

const retireReplicant = (req, res, next) => {
  const bladeRunnerId = req.params.id
  const response = model.retireReplicant(bladeRunnerId, req.body)

  if(response.error) {
    res.status(400).json({ errors: response.error })
  }
  else {
    res.status(200).json({ data: response })
  }
}

const updateRetirement = (req, res, next) => {
  const bladeRunnerId = req.params.id
  const retirementId = req.params.retirementId
  const response = model.updateRetirement(bladeRunnerId, retirementId, req.body)

  if(response.error) {
    res.status(404).json({ errors: response.error })
  } else {
    res.status(200).json({ data: response })
  }
}

const deleteRetirement = (req, res, next) => {
  const bladeRunnerId = req.params.id
  const retirementId = req.params.retirementId
  const response = model.deleteRetirement(bladeRunnerId, retirementId)
  if(response.error) {
    const status = response.error.status
    res.status(status).json({ errors: response.error })
  } else {
    res.status(200).json({ data: response })
  }
}

module.exports = {
  getRetirements,
  getOneRetirement,
  retireReplicant,
  updateRetirement,
  deleteRetirement
}