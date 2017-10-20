const model = require('../model/replicant')

getAllReplicants = (req, res, next) => {
  if(req.query.status) {
    let status = req.query.status
    if (status === 'retired') {
      const retiredReplicants = model.getAllReplicants().filter((replicant => replicant.retired === true))

      res.status(200).json({ data: retiredReplicants })
    } else {
      const activeReplicants = model.getAllReplicants().filter((replicant => replicant.retired === false))
      res.status(200).json({ data: activeReplicants })
    }
  }
  else {
    const replicants = model.getAllReplicants()
    res.status(200).json({ data: replicants })
  }
}

getOneReplicant = (req, res, next) => {
  const id = req.params.id 
  if(id) {
    const response = model.getOneReplicant(id)
    if(response.error) {
      res.status(404).json({ error: { status: 404, message: `Replicant ${id} not found` }})
    } else {
      res.status(200).json({ data: response })
    }
  }
}

createReplicant = (req, res, next) => {
  const response = model.createReplicant(req.body) 
  if(response.error) {
    res.status(400).json(response.error)
  } else {
    res.status(201).json(response)
  }
}

updateReplicant = (req, res, next) => {
  const id = req.params.id
  if(id) {
    const response = model.updateReplicant(id, req.body)
    if(response.error) {
      const error = response.error
      res.status(error.status).json({ error: error })
    } else {
      res.status(200).json({ data: response })
    }
  }
}

deleteReplicant = (req, res, next) => {
  const id = req.params.id
  if(id) {
    const response = model.deleteReplicant(id)
    if(response.error) {
      res.status(response.error.status).json({ error: response.error })
    } else {
      res.status(200).json({ data: response })
    }
  }
}

module.exports = {
  getAllReplicants,
  getOneReplicant,
  createReplicant,
  updateReplicant,
  deleteReplicant
}