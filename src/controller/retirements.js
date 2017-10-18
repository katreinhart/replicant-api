const uuid = require('uuid/v4')
const model = require('../model/retirement')

const getRetirements = (req, res, next) => {
  const response = model.getRetirements(req.params.id)
  res.status(200).json({ data: response })
}

const retireReplicant = (req, res, next) => {
  const bladeRunnerId = req.params.id
  const response = model.retireReplicant(bladeRunnerId, req.body)

  if(response.error) {
    res.status(400).json({ errors: response.error })
  }

  res.status(200).json({ data: response })
}

module.exports = {
  getRetirements,
  retireReplicant
}