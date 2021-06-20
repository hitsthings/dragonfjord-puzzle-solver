import { Board, BoardCellsHelpers, pieces } from "./board.js";

function getFeasiblePlacements(openBoard, piece, openCells) {
    const feasiblePlacements = []
    for(const orientation of piece.orientations) {
        for (let i = 0; i < openBoard.cells.length; i++) {
            for (let j = 0; j < openBoard.cells[i].length; j++) {
                if (openBoard.canPlace(orientation, i, j, openCells)) {
                    feasiblePlacements.push({
                        piece,
                        orientation,
                        i,
                        j
                    })
                }
            }
        }
    }
    return feasiblePlacements
}

function * iteratePlacements(board, piece, openCells){
    for(const orientation of piece.orientations) {
        for (let i = 0; i < board.cells.length; i++) {
            for (let j = 0; j < board.cells[i].length; j++) {
                if (board.canPlace(orientation, i, j, openCells)) {
                    yield {
                        piece,
                        orientation,
                        i,
                        j
                    }
                }
            }
        }
    }
}

function tryPlace(pieces, openCells) {
    let numPlaced = 0
    const board = new Board()
    for (const piece of pieces) {
        const placements = iteratePlacements(board, piece, openCells)
        board.place(orientation, i, j)
        numPlaced++
    }
    return numPlaced === pieces.length ? board : null
}
/**
 * 
 * @param {{piece: Piece, orientation: PieceOrientation, i: number, j: number}[]} placedPieces 
 * @param {{piece: Piece, orientation: PieceOrientation, i: number, j: number}[]} myFeasiblePlacements 
 * @param {{piece: Piece, orientation: PieceOrientation, i: number, j: number}[][]} placementsRequired 
 */
function findNonOverlappingPlacements(placedPieces, placementsRequired) {
    const myFeasiblePlacements = placementsRequired[0]
    if (!myFeasiblePlacements) {
        return placedPieces
    }
    myPlacements: for (const placement of myFeasiblePlacements) {
        const {i, j, orientation } = placement
        for (const { orientation: otherOrientation, i: otherI, j: otherJ } of placedPieces) {
            if(orientation.placementOverlapsOtherPlacement(i, j, otherOrientation, otherI, otherJ)) {
                continue myPlacements
            }
        }
        // this is feasible, check other pieces
        const newPlacedPieces = placedPieces.concat(placement)
        const nonOverlapping = findNonOverlappingPlacements(newPlacedPieces, placementsRequired.slice(1))
        if (nonOverlapping) {
            return nonOverlapping
        }
    }
    return null
}

export function solve(month, day) {
    const openCells = BoardCellsHelpers.cellsFor(month, day)
    const board = new Board()
    const feasiblePlacementsByPiece = pieces.map(piece => getFeasiblePlacements(board, piece, openCells))
    const nonOverlapping = findNonOverlappingPlacements([], feasiblePlacementsByPiece)
    if (!nonOverlapping) {
        return null
    }
    for (const placement of nonOverlapping) {
        if (board.canPlace(placement.orientation, placement.i, placement.j, openCells)) {
            board.place(placement.orientation, placement.i, placement.j)
        } else {
            console.error(nonOverlapping)
            throw new Error("Returned invalid placement. Couldn't place")
        }
    }
    return board
}