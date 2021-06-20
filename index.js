import { display } from "./printer.js"
import { solve } from "./solver.js"

async function main() {
    const now = new Date()
    const board = solve(
        now.getMonth(),
        now.getDate()
    )
    display(board)
}


main().catch(e => console.error(e))
