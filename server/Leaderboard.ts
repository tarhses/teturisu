import { DB } from './deps.ts'
import { Highscore } from '../game/protocol.ts'

export class Leaderboard {
  #db: DB

  public constructor(path: string = ':memory:') {
    this.#db = new DB(path)
    this.#db.query(`
      CREATE TABLE IF NOT EXISTS scores (
        name TEXT NOT NULL,
        score INTEGER NOT NULL,
        timestamp INTEGER NOT NULL
      )
    `)

    if (path === ':memory:') {
      console.info('using in-memory database')
    } else {
      const count = this.#db.query('SELECT COUNT(*) FROM scores')
      console.info(`found ${count.next().value} scores in database`)
    }
  }

  public addScore(name: string, score: number): void {
    console.log(`new score: ${name} - ${score}`)
    this.#db.query(`
      INSERT INTO scores (name, score, timestamp)
      VALUES (?, ?, ?)
    `, [name, score, Date.now()])
  }

  public getScores(page: number = 0): Highscore[] {
    const scores = this.#db.query(`
      SELECT name, score, timestamp FROM scores
      ORDER BY score DESC, rowid ASC
      LIMIT 10 OFFSET ?
    `, [page * 10])

    return Array.from(scores.asObjects()) as Highscore[]
  }
}
