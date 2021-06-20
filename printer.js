import { Board, BoardCellsHelpers } from "./board.js"


const Characters = {
    topConnected: {
        bottomConnected: {
            leftConnected: {
                rightConnected: ' ',
                //rightUnconnected: 'RIGHT ONLY UNCONNECTED',
            },
            leftUnconnected: {
                //rightConnected: 'LEFT ONLY UNCONNECTED',
                rightUnconnected: '═',
            }
        },
        bottomUnconnected: {
            leftConnected: {
                //rightConnected: 'BOTTOM ONLY UNCONNECTED',
                rightUnconnected: '╔',
            },
            leftUnconnected: {
                rightConnected: '╗',
                rightUnconnected: '╦',
            }
        }
    },
    topUnconnected: {
        bottomConnected: {
            leftConnected: {
                //rightConnected: 'TOP ONLY UNCONNECTED',
                rightUnconnected: '╚',
            },
            leftUnconnected: {
                rightConnected: '╝',
                rightUnconnected: '╩',
            }
        },
        bottomUnconnected: {
            leftConnected: {
                rightConnected: '║',
                rightUnconnected: '╠',
            },
            leftUnconnected: {
                rightConnected: '╣',
                rightUnconnected: '╬',
            }
        }
    }
}
/**
 * 
 * @param {*} param0 
 * @returns {string}
 */
const displayCorner = ({ topLeft, topRight, bottomLeft, bottomRight }) => {
    const top = topLeft === topRight ? 'topConnected' : 'topUnconnected'
    const bottom = bottomLeft === bottomRight ? 'bottomConnected' : 'bottomUnconnected'
    const left = topLeft === bottomLeft ? 'leftConnected' : 'leftUnconnected'
    const right = topRight === bottomRight ? 'rightConnected' : 'rightUnconnected'
    return Characters[top][bottom][left][right]
}
const verticalLine = displayCorner({ topLeft: true, topRight: null, bottomLeft: true, bottomRight: null })
const horizontalLine = displayCorner({ topLeft: true, topRight: true, bottomLeft: null, bottomRight: null })
const bottomRightCorner = displayCorner({topLeft: true})
const CONTENT_WIDTH = 5
export const display = (board = new Board()) => {
    let str = ''
    let prevRow = []
    for(let i = 0; i < board.cells.length; i++) {
        const row = board.cells[i]
        let borderStr = ''
        let spacingStr = ''
        let contentStr = ''
        for(let j = 0; j < row.length; j++) {
            const bottomRight = row[j]
            const bottomLeft = row[j-1]
            const topRight = prevRow[j]
            const topLeft = prevRow[j-1]
            borderStr +=
                displayCorner({ topLeft, topRight, bottomLeft, bottomRight }) + // corner
                displayCorner({ topLeft : topRight, topRight, bottomLeft: bottomRight, bottomRight }).repeat(CONTENT_WIDTH) // above cell
            const leftBorder = displayCorner({ topLeft: bottomLeft, topRight: bottomRight, bottomLeft, bottomRight }) // left of cell
            spacingStr += leftBorder + ' '.repeat(CONTENT_WIDTH)
            contentStr += leftBorder + (
                bottomRight === null
                    ? BoardCellsHelpers.valueAt(i, j).padStart(CONTENT_WIDTH-1, ' ').padEnd(CONTENT_WIDTH, ' ')
                    : ' '.repeat(CONTENT_WIDTH))
        }
        if (row.length >= prevRow.length) {
            const j = row.length
            const bottomLeft = row[j-1]
            const topLeft = prevRow[j-1]
            borderStr += displayCorner({ topLeft, bottomLeft })
        } else {
            for(let j = row.length; j < prevRow.length; j++) {
                const topRight = prevRow[j]
                const topLeft = prevRow[j-1]
                const bottomLeft = row[j-1]
                borderStr +=
                    displayCorner({ topLeft, topRight, bottomLeft }) + // corner
                    displayCorner({ topLeft : topRight, topRight }).repeat(5) // above cell
            }
            borderStr += bottomRightCorner

        }
        contentStr += verticalLine
        spacingStr += verticalLine
        
        str += borderStr + '\n' +
            //spacingStr + '\n' +
            contentStr + '\n'// +
            //spacingStr + '\n'
        prevRow = row
    }
    for(let j = 0; j < prevRow.length; j++) {
        const topLeft = prevRow[j-1]
        const topRight = prevRow[j]
        str += displayCorner({ topLeft, topRight }) + horizontalLine.repeat(CONTENT_WIDTH)
    }
    str += bottomRightCorner + '\n'
    console.log(str)
}