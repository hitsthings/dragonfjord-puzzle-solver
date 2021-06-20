
export const Months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
]

export const Days = Array.from({length: 31}, (_, i) => String(i + 1))

export const Shapes = [
    [
        [ true,true,true,false, ],
        [ true,true,true,false, ],
        [ false,false,false,false, ],
    ],
    [
        [ true,true,true,true, ],
        [ true,false,false,false, ],
        [ false,false,false,false, ],
    ],
    [
        [ true,true,true,false, ],
        [ true,false,false,false, ],
        [ true,false,false,false, ],
    ],
    [
        [ true,true,true,true, ],
        [ false,true,false,false, ],
        [ false,false,false,false, ],
    ],
    [
        [ true, false,false,false, ],
        [ true, true, true, false, ],
        [ false,false,true, false, ],
    ],
    [
        [ true,true,true,false, ],
        [ true,true,false,false, ],
        [ false,false,false,false, ],
    ],
    [
        [ true,true,false,false, ],
        [ false,true,true,true, ],
        [ false,false,false,false, ],
    ],
    [
        [ true,true,true,false, ],
        [ true,false,true,false, ],
        [ false,false,false,false, ],
    ],
]

/**
 * @type {(?string)[][]}
 */
export const BoardCells = [
    [ null,null,null,null,null,null, ],
    [ null,null,null,null,null,null, ],
    [ null,null,null,null,null,null,null, ],
    [ null,null,null,null,null,null,null, ],
    [ null,null,null,null,null,null,null, ],
    [ null,null,null,null,null,null,null, ],
    [ null,null,null ],
]
export const BoardCellsHelpers = {
    valueAt(row, col) {
        if (row < 2) {
            return Months[col + 6*row]
        }
        return Days[col + (row - 2)*7]
    },

    cellsFor(month, day) {
        const zeroIndexDay = day - 1
        const monthCell = [Math.floor(month/6), month % 6]
        const dayCell = [2 + Math.floor(zeroIndexDay/7), zeroIndexDay % 7]
        return [monthCell, dayCell]
    }
}

/**
 * 
 * @param {typeof Shapes[number]} shape
 * @returns {[number, number][]}
 */
function offsetsFor(shape) {
    const offsets = []
    for(let i = 0; i < shape.length; i++) {
        for(let j = 0; j < shape[i].length; j++) {
            if (shape[i][j]) {
                offsets.push([i,j])
            }
        }
    }
    return offsets
}

/**
 * 
 * @param {typeof Shapes[number]} shape
 * @returns {[number, number]}
 */
function maxRowAndCol(shape) {
    let maxRow = 0, maxCol = 0
    for(let i = 0; i < shape.length; i++) {
        for(let j = 0; j < shape[i].length; j++) {
            if (shape[i][j]) {
                maxRow = i
                maxCol = Math.max(maxCol, j)
            }
        }
    }
    return [maxRow, maxCol]
}

/**
 * 
 * @param {typeof Shapes[number]} shape 
 * @param {number} rotation 0-3
 * @param {boolean} flipped 
 * @returns {PieceOrientation}
 */
const orient = (_offsets, [maxRow, maxCol], rotation, flipped) => {
    const offsets = flipped
        ? _offsets.map(([i, j]) => [maxRow - i, j])
        : _offsets
    switch(rotation) {
        case 0: return new PieceOrientation(offsets, maxRow, maxCol)
        case 1: return new PieceOrientation(offsets.map(([i,j]) => [j, maxRow-i]), maxCol, maxRow)
        case 2: return new PieceOrientation(offsets.map(([i,j]) => [maxRow-i, maxCol-j]), maxRow, maxCol)
        case 3: return new PieceOrientation(offsets.map(([i,j]) => [maxCol-j, i]), maxCol, maxRow)
    }
    throw new Error('Invalid rotation value.')
}

export class Piece {
    /**
     * @type {PieceOrientation[]}
     */
    orientations

    constructor(shape) {
        this.shape = shape
        const offsets = offsetsFor(shape)
        const maxes = maxRowAndCol(offsets)
        this.orientations = [0,1,2,3].flatMap(rotation => [
            orient(offsets, maxes, rotation, false),
            orient(offsets, maxes, rotation, true)
        ])
    }
}
class PieceOrientation {

    /**
     * @type {{ atI:number, atJ:number, placements:[number,number][] }}
     */
    cachedPlacements

    /**
     * 
     * @param {[number, number][]} offsets 
     * @param {number} maxI 
     * @param {number} maxJ 
     */
    constructor(offsets, maxI, maxJ) {
        this.offsets = offsets
        this.maxI = maxI
        this.maxJ = maxJ
    }
    /**
     * 
     * @param {number} atI 
     * @param {number} atJ 
     * @returns {[number, number][]}
     */
    getPlacementsFor(atI, atJ) {
        if (this.cachedPlacements && this.cachedPlacements.atI === atI && this.cachedPlacements.atJ === atJ) {
            return this.cachedPlacements.placements
        }
        const placements = this.offsets.map(([i, j]) => [atI + i, atJ + j])
        this.cachedPlacements = { atI, atJ, placements }
        return placements
    }
    
    /**
     * 
     * @param {[number, number]} param0 
     * @param {PieceOrientation} otherOrientedPiece 
     * @param {[number, number]} param2 
     */
    placementOverlapsOtherPlacement(atI, atJ, otherOrientedPiece, otherI, otherJ) {
        const inRange = (otherI + otherOrientedPiece.maxI >= atI) && (otherI <= atI + this.maxI) &&
            (otherJ + otherOrientedPiece.maxJ >= atJ) && (otherJ <= atJ + this.maxJ)
        //if (!inRange) return false

        const otherPlacements = otherOrientedPiece.getPlacementsFor(otherI, otherJ)

        for (const [offsetI, offsetJ] of this.offsets) {
            const placeI = atI + offsetI
            const placeJ = atJ + offsetJ
            for (const [otherOffsetI, otherOffsetJ] of otherPlacements) {
                if (placeI === otherOffsetI && placeJ === otherOffsetJ) {
                    return true
                }
            }
        }
        return false
    }
}

export const pieces = Shapes.map(shape => new Piece(shape))

export class Board {
    constructor(cells = BoardCells) {
        this.cells = cells
    }

    _validate(row, col) {
        if (row < 0 || row >= this.cells.length) {
            throw new Error('Row out of bounds: ' + row)
        }
        if (col < 0 || col >= this.cells[row].length) {
            throw new Error('Column out of bounds: ' + col)
        }
    }

    isEmptyCell(row, col) {
        return this.cells[row]?.[col] === null
    }

    /**
     * 
     * @param {PieceOrientation} orientedPiece 
     * @param {*} row 
     * @param {*} col 
     * @param {*} openCells 
     * @returns 
     */
    canPlace(orientedPiece, row, col, openCells) {
        for (const [_i, _j] of orientedPiece.offsets) {
            const i = row + _i
            const j = col + _j
            if (!this.isEmptyCell(i, j)) return false
            if (openCells.some(([ii,jj]) => ii === i && jj === j)) return false
        }
        return true
    }

    place(orientedPiece, row, col) {
        for (const [_i, _j] of orientedPiece.offsets) {
            const i = row + _i
            const j = col + _j
            if (!this.isEmptyCell(i, j)) {
                throw new Error('Cell is not available!')
            }
            this.cells[i][j] = orientedPiece
        }
    }
}