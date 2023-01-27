#! /usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';

interface CebulinhoOptions {
  duration: number;
}

let interval: NodeJS.Timeout;
let endTime: number;
let currentTime: number;
let paused = false;

const commander = new Command();

const startCebulinho = ({duration}: CebulinhoOptions) => {


  const spinner = ora({
    text: `Starting Cebulinho for ${duration} minutes...`,
    color: 'yellow',
  }).start();

  endTime = Date.now() + duration * 60 * 1000;
  currentTime = Date.now();
  interval = setInterval(() => {
    if (paused) return;
    currentTime = Date.now();
    const timeLeft = Math.round((endTime - currentTime) / 1000);
    if (timeLeft <= 0) {
      spinner.succeed(`Cebulinho finished!`);
      clearInterval(interval);
    } else {
      spinner.text = `Time left: ${timeLeft} seconds`;
    }
  }, 1000);
}

const stopCebulinho = () => {
    clearInterval(interval);
    console.log(chalk.red('Cebulinho stopped'));
    process.exit(0);
}

const pauseCebulinho = () => {
    paused = true;
    console.log(chalk.yellow('Cebulinho paused'));
}

const resumeCebulinho = () => {
    paused = false;
    console.log(chalk.green('Cebulinho resumed'));
}

process.stdin.setRawMode(true);
process.stdin.resume();

process.stdin.on('data', (key) => {
  const input = key.toString().trim();
  switch(input) {
    case 'q':
      process.exit();
    case 'p':
      pauseCebulinho();
      break;
    case 'r':
      resumeCebulinho();
      break;
    case 's':
      stopCebulinho()
      break;
    default:
      break;
  }
});

commander
  .version('1.0.0')
  .description('A simple Cebulinho timer')
  .option('-d, --duration <duration>', 'Duration of Cebulinho in minutes')
  .action((cmd) => {
    if (!cmd.duration) {
      console.log(chalk.red('Error: Please provide a duration for the Cebulinho timer'));
      process.exit(1);
    }
    startCebulinho({ duration: parseInt(cmd.duration) });
  });

commander.parse(process.argv);
