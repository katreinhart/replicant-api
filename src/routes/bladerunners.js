const express = require('express')
const router = express.Router()
const ctrl = require('../controller/bladerunners')

router.get('/', ctrl.getAllBladeRunners)
router.get('/:id', ctrl.getOneBladeRunner)
router.post('/', ctrl.createBladeRunner)
router.put('/:id', ctrl.updateBladeRunner)
router.delete('/:id', ctrl.deleteBladeRunner)

module.exports = router