const { Buffer } = require('buffer')
const fsp = require('fs').promises
const path = require('path')

const metroCdmx2Json = async (graph) => {
  const mapa = Buffer.from(tostr(graph), 'utf8')
  const fileName = `Metro CDMX.json`
  const filePath = path.join(process.cwd(), 'routes', fileName)

  await fsp.writeFile(filePath, mapa)
}

const saveRoute = async (route) => {
  const { name, route } = route

  const routes = Buffer.from(tostr(route), 'utf8')
  const filePath = path.join(process.cwd(), 'routes', `${name}.json`)

  await fsp.writeFile(filePath, routes)
}