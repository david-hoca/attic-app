import winston from 'winston';
// Logger yaratish
export const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'app.log' }), // Faylga log saqlash
    ],
});
