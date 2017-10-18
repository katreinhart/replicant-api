const model = require('../model/bladerunner')

getAllBladeRunners = (req, res, next) => {
  const bladerunners = model.getAllBladeRunners()
  res.status(200).json({ data: bladerunners })
}

createBladeRunner = (req, res, next) => {
  const response = model.createBladeRunner(req.body)
  if(response.error) {
    const error = response.error
    res.status(400).json({ error })
  } else {
    res.status(200).json({ data: response })
  }
}

getOneBladeRunner = (req, res, next) => {
  const id = req.params.id
  const response = model.getOneBladeRunner(id)
  if(response.error) {
    const error = response.error
    res.status(404).json({ error })
  } else {
    res.status(200).json({ data: response })
  }
}

module.exports = {
  getAllBladeRunners,
  getOneBladeRunner,
  createBladeRunner
}