#!/usr/bin/env node

const program = require('commander');
const pkg = require('../package.json');
const os = require('os');
const chalk = require('chalk');

const log = console.log;

program
  .version(pkg.version, '-v, --version')
  .usage('<command>')
  .description('this is a easy-cli');

program
  .command('now')
  .description('显示当前的日期和时间')
  .action(function () {
    let time = new Date();
    let month = time.getMonth() + 1;
    let date = time.getDate();
    let week = getWeekday(time.getDay());
    let hour = addZero(time.getHours());
    let miniute = addZero(time.getMinutes());
    let second = addZero(time.getSeconds());

    let text = `${month}月${date}日 ${week} ${hour}:${miniute}:${second}`;
    log(chalk.blue.bold(text));
  });

program
  .command('myip')
  .description('显示当前的 IP 地址')
  .action(function () {
    let myip = os.networkInterfaces().WLAN[1].address;
    log(chalk.green(myip))
  })

program.parse(process.argv);

function addZero(num) {
  if (num < 10) {
    return '0' + num.toString();
  } else {
    return num;
  }
}

function getWeekday(day) {
  switch (day) {
    case 0:
      return '周日';
    case 1:
      return '周一';
    case 2:
      return '周二';
    case 3:
      return '周三';
    case 4:
      return '周四';
    case 5:
      return '周五';
    default:
      return '周六';
  }
}

if (!process.argv.slice(2).length) {
  program.outputHelp(redTip);
}

function redTip(txt) {
  return chalk.red(txt);
}