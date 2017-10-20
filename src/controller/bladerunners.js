const model = require('../model/bladerunner')

getAllBladeRunners = (req, res, next) => {
  const filter = req.query
  switch(filter.species) {
    case 'human': 
      const humanBRs = model.getAllBladeRunners().filter(br => br.species === 'human')
      res.status(200).json({ data: humanBRs })
      break
    case 'replicant':
      const replBRs = model.getAllBladeRunners().filter(br => br.species === 'replicant')
      res.status(200).json({ data: replBRs })
      break
    default: 
      const bladerunners = model.getAllBladeRunners()
      res.status(200).json({ data: bladerunners })
  }
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

updateBladeRunner = (req, res, next) => {
  const id = req.params.id
  const response = model.updateBladeRunner(id, req.body)
  if(response.error) {
    const error = response.error
    res.status(error.status).json({ error })
  } else {
    res.status(200).json({ data: response })
  }
}

deleteBladeRunner = (req, res, next) => {
  const id = req.params.id
  const response = model.deleteBladeRunner(id)
  if(response.error) {
    const error = response.error
    res.status(error.status).json({ error })
  } else {
    res.status(200).json({ data: response })
  }
}

module.exports = {
  getAllBladeRunners,
  getOneBladeRunner,
  createBladeRunner,
  updateBladeRunner,
  deleteBladeRunner
}