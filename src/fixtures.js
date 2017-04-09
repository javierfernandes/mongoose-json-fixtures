import minimist from 'minimist'
import { run } from './fixtures-run' 

/*
 * Run with args like this
 *
 * npm run fixtures -- --dropDB
 */
const args = minimist(process.argv.slice(2))
console.log('Running with args', args)

run(args).catch(err => {
  console.error(err.stack)
})


