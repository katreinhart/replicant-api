const express = require('express')
const router = express.Router({ mergeParams: true })
const ctrl = require('../controller/retirements')

router.get('/', ctrl.getRetirements)
router.post('/', ctrl.retireReplicant)
router.get('/:retirementId', ctrl.getOneRetirement)
router.put('/:retirementId', ctrl.updateRetirement)

module.exports = router