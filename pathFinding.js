
async function findShortestPat(grid, startX, startY, endX, endY) {
    let open = []
    let closed = new Set()
}

async function findShortestPath(grid, startX, startY, targetX, targetY) {
    let open = []
    let closed = new Set()
    let startNode = grid.getNode(startX, startY)
    let targetNode = grid.getNode(targetX, targetY)

    startNode.gCost = 0
    open.push(startNode)

    while (open.length > 0) {

        let currentNode = open[0]
        let idx = 0
        for (let i = 1; i < open.length; i++) {

            if (open[i].fCost < currentNode.fCost || (open[i].fCost === currentNode.fCost && open[i].hCost < currentNode.hCost)) {
                currentNode = open[i]
                idx = i
            }
        }

        open.splice(idx, 1)
        closed.add(currentNode)
        
        // currentNode === targetNode doesn't work because js creates a copy of the endNode and does not update the parent variable
        if (currentNode.x === targetNode.x && currentNode.y === targetNode.y) {
            let path = []
            currentNode = currentNode.parent
            while (currentNode.parent) {
                path.push(currentNode)
                currentNode = currentNode.parent
            }
            return path
        }

        for (let neighbour of getNeighbours(grid, currentNode)) {
            if (!neighbour.walkable || closed.has(neighbour)) { continue }


            let newCost = currentNode.gCost + getDistance(currentNode, neighbour)
            if (newCost < neighbour.gCost || !open.includes(neighbour)) {
                neighbour.gCost = newCost

                neighbour.hCost = getDistance(neighbour, targetNode)
                neighbour.parent = currentNode

                if (!open.includes(neighbour)) {
                    open.push(neighbour)
                }
            }
        }
    }
    return []
}

function getNeighbours(grid, node) {
    let neighbours = []
    for (let y = -1; y <= 1; y++) {
        for (let x = -1; x <= 1; x++) {
            if (y === 0 && x === 0) { continue }
            let cX = node.x + x
            let cY = node.y + y
            if (cY >= 0 && cY < grid.height && cX >= 0 && cX < grid.width) {
                neighbours.push(grid.getNode(cX, cY))
            }
        }
    }
    return neighbours
}

function getDistance(nodeA, nodeB) {
    let dX = Math.abs(nodeA.x - nodeB.x)
    let dY = Math.abs(nodeA.y - nodeB.y)

    const F = Math.SQRT2 - 1
    if (dX > dY) {
        return F * dY + dX
    }

    return F * dX + dY
}