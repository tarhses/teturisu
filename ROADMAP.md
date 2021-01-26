# TETURISU! &mdash; Roadmap

This list follows an approximative priority order. Items marked with a :book: are rules from [the Guideline](https://tetris.wiki/Tetris_Guideline).

1. :book: Change the speed curve and levels to follow [the Guideline](https://tetris.wiki/Marathon).
2. Add a way to change player name during a game, and/or when submitting a score, and/or when joining a public room without a name.
3. Add support for smaller screens. Currently, board sizes are fixed and the dashboard is... _whimsical_.
4. :book: Implement hard drops.
5. Change lock down type, infinity is broken.
6. Add touch screen support (for smartphones, of course).
7. Handle server disconnection (notify the user at least).
8. Enhance board rendering.
   1. :book: Add a ghost piece.
   2. Add a button cheat sheet at start to teach the player how to play. It could also detect if a touch screen is used.
   3. Juice it? (i.e. screen shake, particles, points display, special effects, sound design, etc.). Add more feedback.
   4. Maybe find a way to display longer player names (a bit broken right now).
9. Enhance high scores page.
   1. Leave the current room when displaying it (not the case right now :grin:)
   2. Show the scores' dates.
   3. Add next and previous buttons to fetch high scores beyond the 10 first ones.
   4. Find a way to make it more accessible (maybe not hidden on a separate page).
   5. Add filters maybe ("all time", "this week", "today", etc.).
10. Code refactoring!
    1. Some assertion(s) in the server do(es) not hold (_oops_).
    2. Implement client-side protocol as javascript promises. Currently, it's using callbacks that are all over the place. Responses should be associated with their requests by using function calls like `const res = await connection.joinRoom()`.
    3. Split game logic and rollback system. Currently, everything is in one big class (`Game`). A general refactoring of the game logic is needed.
    4. Store game states in the server. Currently, it's recording inputs in arrays, and only when a client submits a score does it verify the inputs. A proper server implementation should automatically detect game overs. That's impossible if inputs are just recorded and not executed.
    5. A `Game` store a giant array containing an history that only increases. Should I care about this memory leak? (_well, probably_).
    6. In parallel, complete unit tests! Should I use jest (current situation) or Deno unit tests? probably both.
11. Add a limit of players in one room? Currently, there's no limit and that could cause the game to slow down (_or a DDoS, or whathever_).
12. :book: Add garbage system somehow, maybe as an option in private rooms?
13. :book: Add combos, back-to-backs, t-spins, etc. detection to the scoring system.
14. :book: Add hold mechanism? Not sure if I want that (maybe with back-to-backs detection).

