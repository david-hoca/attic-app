var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Redis } from 'ioredis';
import { promisify } from 'util';
// Redis serverga ulanish uchun o'zgaruvchilar
const redisHost = process.env.REDIS_HOST || 'localhost'; // Redis serverning host nomi yoki IP manzili
const redisPort = parseInt(process.env.REDIS_PORT || '6379', 10); // Redis serverning porti
// Redis klientni yaratish
const client = new Redis({
    host: redisHost,
    port: redisPort,
    lazyConnect: true, // "true" deb sozlash
});
// Redis-ga ulanish
client.connect();
client.on('connect', function () {
    console.log('Redis serverga muvaffaqiyatli bog\'landi');
});
// Xatolik yuz berib qolganida
client.on('error', function (error) {
    console.error('Redis serverga bog\'lanishda xatolik yuz berdi:', error);
});
// Redis ga ma'lumot yozish va olish uchun yordamchi funksiyalar
const asyncGet = promisify(client.get).bind(client);
const asyncSet = promisify(client.set).bind(client);
// Redisga ma'lumotni yozish
function setRedisData(key, value) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield asyncSet(key, JSON.stringify(value));
        }
        catch (error) {
            console.error('Redisga ma\'lumotni yozishda xatolik yuz berdi:', error);
            throw new Error('Redisga ma\'lumotni yozishda xatolik yuz berdi');
        }
    });
}
// Redisdan ma'lumot olish
function getRedisData(key) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = yield asyncGet(key);
            return data ? JSON.parse(data) : null;
        }
        catch (error) {
            console.error('Redisdan ma\'lumot olishda xatolik yuz berdi:', error);
            throw Error('Redisdan ma\'lumot olishda xatolik yuz berdi');
        }
    });
}
// Redisga ma'lumotni yangilash
function updateRedisData(key, value) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield asyncSet(key, JSON.stringify(value));
        }
        catch (error) {
            console.error('Redisga ma\'lumotni yangilashda xatolik yuz berdi:', error);
            throw new Error('Redisga ma\'lumotni yangilashda xatolik yuz berdi');
        }
    });
}
function deleteRedisData(key) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield client.del(key);
        }
        catch (error) {
            console.error('Redisdan ma\'lumotni o\'chirishda xatolik yuz berdi:', error);
            throw new Error('Redisdan ma\'lumotni o\'chirishda xatolik yuz berdi');
        }
    });
}
export { setRedisData, getRedisData, updateRedisData, deleteRedisData };
