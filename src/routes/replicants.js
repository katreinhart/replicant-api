const express = require('express')
const router = express.Router()
const ctrl = require('../controller/replicants')

router.get('/', ctrl.getAllReplicants)
router.get('/:id', ctrl.getOneReplicant)
router.post('/', ctrl.createReplicant)
router.put('/:id', ctrl.updateReplicant)
router.delete('/:id', ctrl.deleteReplicant)

module.exports = router