class Node {
    constructor(x, y, walkable = true) {
        this.gCost = 0
        this.hCost = 0
        this.walkable = walkable
        this.parent
        this.x = x
        this.y = y
    }

    get fCost() {
        return this.gCost + this.hCost
    }
}