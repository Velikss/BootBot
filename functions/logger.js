const chalk = require("chalk");
const date = require("date-and-time");

class Logger {
    static log(log, type = "log") {
        const now = new Date();
        const timestamp = `[${date.format(now, "ddd MM DD | hh:mm:ss A")}]:`;

        switch (type) {
        case "log":
        {
            return console.log(`${timestamp} ${chalk.green(type.toUpperCase())} ${log} `);
        }
        case "error":
        {
            return console.log(`${timestamp} ${chalk.bgRedBright(type.toUpperCase())} ${log} `);
        }
        case "warning":
        {
            return console.log(`${timestamp} ${chalk.red(type.toUpperCase())} ${log} `);
        }
        case "ready":
        {
            return console.log(`${timestamp} ${chalk.greenBright(type.toUpperCase())} ${log} `);
        }
        case "cmd":
        {
            return console.log(`${timestamp} ${chalk.cyan(type.toUpperCase())} ${log} `);
        }
        case "dm":
        {
            return console.log(`${timestamp} ${chalk.blue(type.toUpperCase())} ${log} `);
        }
        case "event":
        {
            return console.log(`${timestamp} ${chalk.yellow(type.toUpperCase())} ${log} `);
        }
        case "greet":
        {
            return console.log(`${timestamp} ${chalk.blue(type.toUpperCase())} ${log} `);
        }
        }
    }

    static error(log) {
        return this.log(log, "error");
    }

    static warn(log) {
        return this.log(log, "warning");
    }
}

module.exports = Logger;
