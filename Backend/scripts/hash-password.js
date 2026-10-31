// Usage:
//   npm run hash-password                      prompts (input hidden) and asks twice
//   npm run hash-password -- 'your password'   non-interactive (ends up in shell history)
// Prints only the bcrypt hash on stdout; prompts go to stderr.
import readline from 'node:readline';
import bcrypt from 'bcryptjs';

const MIN_LENGTH = 12;

const rl = readline.createInterface({ input: process.stdin, output: process.stderr, terminal: Boolean(process.stdin.isTTY) });
let muted = false;
const write = rl._writeToOutput.bind(rl);
// Hide what is typed, but still print the prompt itself.
rl._writeToOutput = (text) => {
  if (!muted) write(text);
};
// One interface for both prompts (a second one would lose piped input).
const lines = rl[Symbol.asyncIterator]();
const ask = async (question) => {
  process.stderr.write(question);
  muted = Boolean(process.stdin.isTTY);
  const { value } = await lines.next();
  muted = false;
  if (process.stdin.isTTY) process.stderr.write('\n');
  return value ?? '';
};

const fail = (message) => {
  console.error(message);
  process.exit(1);
};

let pw = process.argv[2];
if (pw === undefined) {
  pw = await ask('New admin password: ');
  if (pw.length < MIN_LENGTH) fail(`Password must be at least ${MIN_LENGTH} characters.`);
  const again = await ask('Repeat password: ');
  if (again !== pw) fail('Passwords do not match.');
}
if (pw.length < MIN_LENGTH) fail(`Provide a password of at least ${MIN_LENGTH} characters.`);

rl.close();
console.log(bcrypt.hashSync(pw, 12));
