const tostr = (item) => JSON.stringify(item, null, 2)

const addEdge = (graph, from, to) => {
  if (graph[from] === undefined) {
    graph[from] = [to];
    return graph
  }
  graph[from].push(to);
  return graph
}

const buildGraph = (edges) => {
  let graph = Object.create(null);
  const edgesMap = edges.map((r) => r.split("-"))

  for (let [from, to] of edgesMap) {
    graph = {
      ...addEdge(graph, from, to),
      ...addEdge(graph, to, from),
      ...graph,
    }
  }
  return graph;
}

const findRoute = (graph, from, to) => {
  const parsedGraph = typeof graph === 'string'
    ? JSON.parse(graph)
    : graph

  let work = [{ at: from, route: [] }];
  let i = 0
  while (i < work.length) {
    let { at, route } = work[i];

    for (let place of parsedGraph[at]) {
      if (place === to) {
        const newRoute = route.concat(place)
        return newRoute;
      }
      if (!work.some((w) => w.at === place)) {
        work.push({ at: place, route: route.concat(place) });
      }
    }
    i++
  }
  return work
}

const createRouteName = (to, from) => `${to}-${from}`

const createRoute = (graph, to, from) => {
  const thisRoute = createRouteName(to, from)
  const name = thisRoute
  return {
    name,
    route: findRoute(graph, to, from)
  }
}

const bufferToJSON = (buffer) => JSON.parse(buffer.toString())

module.exports = {
  tostr,
  buildGraph,
  findRoute,
  createRouteName,
  createRoute,
  bufferToJSON,
}