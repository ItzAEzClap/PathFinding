const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
canvas.width = window.innerWidth
canvas.height = window.innerHeight

let dimW = 25
const width = Math.ceil(canvas.width / dimW)
dimW = canvas.width / width
const height = Math.ceil(canvas.height / dimW)
let dimH = canvas.height / height

let grid = new Grid(width, height)
let startNode = grid.getNode(0, 0)
let targetNode = grid.getNode(width - 1, height - 1)

async function animate() {
    // Draw grid
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let node = grid.getNode(x, y)
            c.beginPath()
            c.fillStyle = node.walkable ? 'lightgreen' : 'red'
            if (node === startNode) { c.fillStyle = 'green' }
            if (node === targetNode) { c.fillStyle = 'blue' }
            c.fillRect(dimW * x, dimH * y, dimW, dimH)
        }
    }


    try {
        c.fillStyle = 'black'
        for (let node of await findShortestPath(grid, startNode.x, startNode.y, targetNode.x, targetNode.y)) {
            c.fillRect(node.x * dimW, node.y * dimH, dimW, dimH)
        }
    } catch {
        console.log("OOPS")
    }

    console.log(following)

    await new Promise(resolve => setTimeout(resolve, 16))
    requestAnimationFrame(animate)
}

window.addEventListener("mousemove", (e) => {
    let x = Math.floor(e.clientX / dimW)
    let y = Math.floor(e.clientY / dimH)

    if (y < 0 || y >= height || x < 0 || x >= width) {
        return
    }

    let node = grid.getNode(x, y)

    if (following == startNode) {
        startNode = node
        following = node
    } else if (following == targetNode) {
        targetNode = node
        following = node
    } else if (down) {
        node.walkable = mode
    }
})

window.addEventListener("mousedown", (e) => {
    let x = Math.floor(e.clientX / dimW)
    let y = Math.floor(e.clientY / dimH)

    if (y < 0 || y >= height || x < 0 || x >= width) {
        return
    }

    down = true
    let node = grid.getNode(x, y)

    if (node == startNode || node == targetNode) {
        following = node
    } else {
        node.walkable = !node.walkable
        mode = node.walkable
    }
    
})

window.addEventListener("mouseup", (e) => {
    down = false
    mode = null
    following = null
})

let mode = null
let following = null
let down = false
/*
let changed = [startNode, targetNode]

window.addEventListener('mousemove', (e) => {
    let y = Math.floor(e.clientY / dimH)
    let x = Math.floor(e.clientX / dimW)
    if (y < 0 || y >= height || x < 0 || x >= width) { return }

    let node = grid.getNode(x, y)

    if (node.walkable) {
        if (startNode.follow && node !== targetNode ||
            targetNode.follow && node !== startNode) {
                node.follow = false

                if (startNode.follow) { startNode = node; startNode.parent = undefined }
                if (targetNode.follow) { targetNode = node }

                node.follow = true
                return
            }
    }

    if (!down || changed.includes(node)) { return }

    node.walkable = !node.walkable
    changed.push(node)
})

window.addEventListener('mousedown', (e) => {
    let y = Math.floor(e.clientY / dimH)
    let x = Math.floor(e.clientX / dimW)

    if (y < 0 || y >= height || x < 0 || x >= width) { return }

    let node = grid.getNode(x, y)
    if (node === startNode || node === targetNode) { node.follow = true; return }

    down = true
    node.walkable = !node.walkable
    changed.push(node)
})

window.addEventListener('mouseup', () => {
    changed = [startNode, targetNode]
    down = startNode.follow = targetNode.follow = false
})*/

animate()