# Solver for A-Puzzle-A-Day by Dragonfjord

I just bought [this awesome puzzle](https://www.dragonfjord.com/product/a-puzzle-a-day/) and have been enjoying it along with my sons.

Some days are easy, but other days can be extremely hard to solve! As a fun project with the kids and an escape hatch when we need one, together we wrote this command-line solver. Requires Node 16.

## Usage

Clone the repository and run `node index.js` using Node 16

After a few seconds you'll get some ASCII art like:

```ascii
╔═════════════════╦═══════════╦═════╗
║                 ║           ║ Jun ║
║                 ║           ╠═════╣
║                 ║           ║     ║
╠═════╦═══════════╩═════╗     ║     ╠═════╗
║     ║                 ║     ║     ║     ║
║     ╚═══════════╗     ╠═════╝     ║     ║
║                 ║     ║           ║     ║
╠═══════════╗     ║     ║     ╔═════╣     ║
║           ║     ║     ║     ║  20 ║     ║
║     ╔═════╩═════╩═════╩═════╬═════╝     ║
║     ║                       ║           ║
║     ╚═════╗     ╔═══════════╩═══════════╝
║           ║     ║
╚═══════════╩═════╝
```

If you want to specify a different day, use `node cli.js 23/12` (or whatever DD/MM you want to solve for).

Enjoy!

## Fine print

Copyright 2021, Adam Ahmed

Licensed for use under GNU General Public License - See [http://www.gnu.org/licenses/gpl.html](http://www.gnu.org/licenses/gpl.html)

I have no affiliation with Dragonfjord, just enjoyed their puzzle.
