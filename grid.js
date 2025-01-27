class Grid {
    constructor(width, height) {
        this.grid;
        this.width = width
        this.height = height

        this.createGrid()
    }

    createGrid() {
        this.grid = new Array(this.height);

        for (let i = 0; i < this.height; i++) {
            this.grid[i] = new Array(this.width)

            for (let j = 0; j < this.width; j++) {
                this.grid[i][j] = new Node(j, i)
            }
        }
    }

    getNode(x, y) {
        return this.grid[y][x]
    }
}