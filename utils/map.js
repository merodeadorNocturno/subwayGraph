const createAdjacencyList = (stations) => {
  const adjacencyList = new Map()

  stations.forEach((element) => {
    const [to, from] = element.split('-')
    if (adjacencyList.get(to) === undefined) {
      adjacencyList.set(to, new Set())
    }
    if (adjacencyList.get(from) === undefined) {
      adjacencyList.set(from, new Set())
    }
    adjacencyList.get(to).add(from)
    adjacencyList.get(from).add(to)
  });

  return adjacencyList
}

const shortestPathBfs = (startNode, stopNode) => {
  const previous = new Map();
  const visited = new Set();
  const queue = [];
  queue.push({ node: startNode, dist: 0 });
  visited.add(startNode);

  while (queue.length > 0) {
    const { node, dist } = queue.shift();
    if (node === stopNode) {
      return {
        shortestDistance: dist,
        previous,
      };
    }
    for (let neighbour of adjacencyList.get(node)) {
      if (!visited.has(neighbour)) {
        previous.set(neighbour, node);
        queue.push({
          node: neighbour,
          dist: dist + 1
        });
        visited.add(neighbour);
      }
    }
  }
  return { shortestDistance: -1, previous };
};

const createRouteFromShortestPath = (previous, to, buffer = []) => {
  if (to === undefined) {
    return buffer.reverse()
  }

  const prev = previous.get(to)
  buffer.push(to)
  return getRoute(previous, prev, buffer)
}