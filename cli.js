import { display } from "./printer.js"
import { solve } from "./solver.js"

async function main(args) {
    const dateArg = args[0] === '--' ? args[1] : args[0]
    if (dateArg && !/\d{1,2}[-/\\]\d{1,2}/.test(dateArg)) {
        throw new Error('Invalid date argument: ' + dateArg)
    }
    const now = new Date()
    let [day, month] = dateArg
        ? dateArg.split(/\D/).map(n => parseInt(n, 10))
        : [
            now.getDate(),
            now.getMonth() + 1,
        ]
    console.log("solving for day " + day + ' of month ' + month)
    const board = solve(
        month-1,
        day
    )
    display(board)
}


main((process.argv).slice(2)).catch(e => console.error(e))
