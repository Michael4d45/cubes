interface Attributes {
    color: number
}

interface Position {
    x: number,
    y: number,
    z: number
}

interface Cube {
    position: Position,
    attributes: Attributes
}

interface Cubes {
    array: Array<Cube>,
    count: number
}