const http = require('http')

const { createClient } = require('redis')
const {
  tostr,
  buildGraph,
  createRouteName,
  createRoute,
  bufferToJSON,
} = require('./utils/route')

let to = 'Calle 11'
let from = 'Los Reyes'
let del = null

const createRedisClient = () => {
  const client = createClient();

  client.on('ready', () => console.log('Redis Client is ready'));
  client.on('error', (err) => console.log('Redis Client Error', err));

  return client
}

const myGraph = async () => {
  const client = createRedisClient();

  await client.connect();

  if (del !== null) {
    await client.del(del)
  }

  let subwayGraph = await client.get('Metro-CDMX')

  if (subwayGraph === null) {
    const roads = require('./utils/routes')
    subwayGraph = buildGraph(roads);

    await client.set('Metro-CDMX', tostr(subwayGraph))
  }

  const key = createRouteName(to, from)

  console.time('awaitRedis')
  let value = await client.get(key);
  console.timeEnd('awaitRedis')

  if (value === null) {
    console.time('createRoute')
    value = tostr(createRoute(subwayGraph, to, from))
    console.timeEnd('createRoute')

    await client.set(key, value);
  }

  client.quit()

  return value
}

const delEntry = async (entry) => {
  const client = createRedisClient()
  await client.connect()

  return client.del(entry)
}

const server = http.createServer(async (req, res) => {
  let fileContents = ''

  if (req.method === 'DELETE') {
    const entry = req.url.slice(1)
    await delEntry(entry)
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end()
  
  }

  if (req.method === 'POST') {
    req.on('data', (d) => {
      ({ to, from } = bufferToJSON(d))
      console.log(bufferToJSON(d))
    })
  }

  fileContents = await myGraph()

  res.writeHead(200, { 'Content-Type': 'application/json' })

  res.write(fileContents)

  res.end()

})

server.listen(5000)

console.log('Nodejs server running at port 5000')