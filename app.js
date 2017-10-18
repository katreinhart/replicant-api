const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')

const port = process.env.PORT || 3000

app.disable('x-powered-by')
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'))
app.use(bodyParser.json())

const replicantRoutes = require('./src/routes/replicants')
app.use('/replicants', replicantRoutes)

const bladeRunnerRoutes = require('./src/routes/bladerunners')
app.use('/bladerunners', bladeRunnerRoutes)

app.use((err, req, res, next) => {
  const status = err.status || 500
  res.status(status).json({ error: err })
})

app.use((req, res, next) => {
  res.status(404).json({ error: { message: 'Not found' }})
})

const listener = () => console.log(`Listening on port ${port}!`)
app.listen(port, listener)

module.exports = app