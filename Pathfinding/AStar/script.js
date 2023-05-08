const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
canvas.width = window.innerWidth
canvas.height = window.innerHeight

let dimW = 25
const width = Math.ceil(canvas.width / dimW)
dimW = canvas.width / width
const height = Math.ceil(canvas.height / dimW)
let dimH = canvas.height / height

let grid = createGrid(width, height)
let startNode = grid[0][0]
let targetNode = grid[height - 1][width - 1]

function createGrid(width, height) {
    let grid = []
    for (let i = 0; i < height; i++) {
        grid.push([])
        for (let j = 0; j < width; j++) {
            grid[i].push(new Node(j, i, true))
        }
    }
    return grid
}

function draw(grid) {
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            c.beginPath()
            c.fillStyle = grid[y][x].walkable ? 'lightgreen' : 'red'
            if (grid[y][x] === startNode) { c.fillStyle = 'green' }
            if (grid[y][x] === targetNode) { c.fillStyle = 'blue' }
            c.fillRect(dimW * x, dimH * y, dimW, dimH)
        }
    }
}

async function animate() {
    draw(grid)

    c.fillStyle = 'black'
    for (let node of await findShortestPath(grid, startNode, targetNode)) {
        c.fillRect(node.x * dimW, node.y * dimH, dimW, dimH)
    }

    await new Promise(resolve => setTimeout(resolve, 10))
    requestAnimationFrame(animate)
}


let down = false
let changed = [startNode, targetNode]

window.addEventListener('mousemove', (e) => {
    let y = Math.floor(e.clientY / dimH)
    let x = Math.floor(e.clientX / dimW)
    if (y < 0 || y >= height || x < 0 || x >= width) { return }

    if (grid[y][x].walkable) {
        if (startNode.follow && grid[y][x] !== targetNode ||
            targetNode.follow && grid[y][x] !== startNode) {
                grid[y][x].follow = false

                if (startNode.follow) { startNode = grid[y][x]; startNode.parent = undefined }
                if (targetNode.follow) { targetNode = grid[y][x] }

                grid[y][x].follow = true
                return
            }
    }

    if (!down || changed.includes(grid[y][x])) { return }

    grid[y][x].walkable = !grid[y][x].walkable
    changed.push(grid[y][x])
})

window.addEventListener('mousedown', (e) => {
    let y = Math.floor(e.clientY / dimH)
    let x = Math.floor(e.clientX / dimW)

    if (y < 0 || y >= height || x < 0 || x >= width) { return }
    if (grid[y][x] === startNode || grid[y][x] === targetNode) { grid[y][x].follow = true; return }

    down = true
    grid[y][x].walkable = !grid[y][x].walkable
    changed.push(grid[y][x])
})

window.addEventListener('mouseup', () => {
    changed = [startNode, targetNode]
    down = startNode.follow = targetNode.follow = false
})

animate()