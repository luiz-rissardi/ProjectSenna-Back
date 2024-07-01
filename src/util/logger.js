import { createLogger, format, transports } from 'winston';

const typeOfLogs = createLogger({
    level: 'debug', // Defina o nível de log desejado (pode ser 'debug', 'info', 'warn', 'error', etc.)
    format: format.combine(
        format.colorize(),
        format.timestamp(),
        format.printf(({ level, timestamp, message }) => {
            return `${DateFormat(timestamp)} ${level}: ${message}`;
        })
    ),
    transports: [new transports.Console],
});

const loggers = {
    info: typeOfLogs.info.bind(this),
    warn: typeOfLogs.warn.bind(this),
    error: typeOfLogs.error.bind(this),
}


export { loggers };