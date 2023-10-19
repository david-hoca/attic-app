var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import UserModel from './user.model.js';
import handleError from '../../utils/catchError.js';
import { JWT } from '../../utils/jwt.js';
import { sendConfirmationEmail } from '../../utils/nodemailer.js';
import { deleteRedisData, getRedisData, setRedisData } from '../../db/redistGlobal.js';
import crypto from 'crypto';
class UserController {
    constructor() {
        // Create a new user
        this.createUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let { username, email, password, role, confirmationCode, } = req.body;
                if (!confirmationCode) {
                    const generatedConfirmationCode = yield sendConfirmationEmail(email);
                    yield setRedisData(email, generatedConfirmationCode);
                    res.send({
                        success: true,
                        payload: generatedConfirmationCode,
                        msg: "Confirmation code sent to the email "
                    });
                }
                else {
                    if (confirmationCode !== (yield getRedisData(email))) {
                        res.status(400).send({
                            success: false,
                            msg: "The confirmation code you entered is incorrect. Please try again."
                        });
                    }
                    else {
                        const passwordHash = crypto.createHash('sha256').update(password).digest('hex');
                        const user = new UserModel({ username, email, role: role ? role : 'user', password: passwordHash });
                        const newUser = yield user.save();
                        let token = JWT.SIGN({ id: newUser._id });
                        res.status(201).send({
                            success: true,
                            token,
                            data: newUser
                        });
                        yield deleteRedisData(email);
                    }
                }
            }
            catch (error) {
                handleError(res, error);
            }
        });
        // Get all users
        this.getAllUsers = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield UserModel.find();
                res.status(200).send({
                    success: true,
                    data: users
                });
            }
            catch (error) {
                handleError(res, error);
            }
        });
        // Get user by ID
        this.getUserById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const user = yield UserModel.findById(id).populate("boughtPost likedPost");
                if (!user) {
                    res.status(404).json({ error: 'User not found' });
                    return;
                }
                res.status(200).send({
                    succsess: true,
                    data: user
                });
            }
            catch (error) {
                handleError(res, error);
            }
        });
        this.getUserByToken = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let token = req.headers.token;
                let { id } = JWT.VERIFY(token);
                const user = yield UserModel.findById(id).populate("boughtPost likedPost");
                if (!user) {
                    res.status(404).json({ error: 'User not found' });
                    return;
                }
                res.status(200).send({
                    succsess: true,
                    data: user
                });
            }
            catch (error) {
                handleError(res, error);
            }
        });
        // Update user by ID
        this.updateUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            let { password, } = req.body;
            try {
                // Parolni SHA-256 bilan heshlash
                if (password) {
                    const passwordHash = crypto.createHash('sha256').update(password).digest('hex');
                    req.body.password = passwordHash;
                }
                const updatedUser = yield UserModel.findByIdAndUpdate(id, req.body, { new: true });
                if (!updatedUser) {
                    res.status(404).json({ error: 'User not found' });
                    return;
                }
                res.status(200).send({
                    success: true,
                    data: updatedUser
                });
            }
            catch (error) {
                handleError(res, error);
            }
        });
        this.updateUserByToken = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let { password, } = req.body;
            try {
                let token = req.headers.token;
                let { id } = JWT.VERIFY(token);
                // Parolni SHA-256 bilan heshlash
                if (password) {
                    const passwordHash = crypto.createHash('sha256').update(password).digest('hex');
                    password = passwordHash;
                }
                const updatedUser = yield UserModel.findByIdAndUpdate(id, req.body, { new: true });
                if (!updatedUser) {
                    res.status(404).json({ error: 'User not found' });
                    return;
                }
                res.status(200).send({
                    success: true,
                    data: updatedUser
                });
            }
            catch (error) {
                handleError(res, error);
            }
        });
        // Delete user by ID
        this.deleteUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const deletedUser = yield UserModel.findByIdAndDelete(id);
                if (!deletedUser) {
                    res.status(404).json({ error: 'User not found' });
                    return;
                }
                res.status(204).send({ success: true, data: [] });
            }
            catch (error) {
                handleError(res, error);
            }
        });
        this.login = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            try {
                // Foydalanuvchini email orqali qidirish
                const user = yield UserModel.findOne({ email });
                if (!user) {
                    // Foydalanuvchi topilmagan
                    res.status(404).json({ error: 'Foydalanuvchi topilmadi' });
                    return;
                }
                // Parolni tekshirish
                const passwordHash = crypto.createHash('sha256').update(password).digest('hex');
                if (user.password !== passwordHash) {
                    // Noto'g'ri parol
                    res.status(401).json({ error: 'Noto\'g\'ri parol' });
                    return;
                }
                // Foydalanuvchi uchun yangi JWT (token) yaratish
                const token = JWT.SIGN({ id: user._id });
                // Tokenni klientga jo'natish
                res.status(200).send({ succsess: true, token, data: user });
            }
            catch (error) {
                handleError(res, error);
            }
        });
        this.forgetPassword = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { email, password, confirmationCode } = req.body;
            try {
                // Foydalanuvchi email orqali qidirish
                const user = yield UserModel.findOne({ email });
                if (!user) {
                    // Foydalanuvchi topilmagan
                    res.status(404).json({ error: 'Foydalanuvchi topilmadi' });
                    return;
                }
                if (!confirmationCode) {
                    // Tasdiqlash kodi yaratish va email orqali yuborish
                    const generatedConfirmationCode = yield sendConfirmationEmail(email);
                    yield setRedisData(email, generatedConfirmationCode);
                    res.status(200).json({
                        success: true,
                        message: "Foydalanuvchi ma'lumotlari yuborildi. Tasdiqlash kodi yuborildi",
                        confirmationCode: generatedConfirmationCode // Tasdiqlash kodi javob qaytariladi
                    });
                }
                else if (confirmationCode !== (yield getRedisData(email))) {
                    // Tasdiqlash kodi noto'g'ri kiritilgan
                    res.status(400).json({
                        success: false,
                        error: "Noto'g'ri tasdiqlash kodi"
                    });
                }
                else {
                    // Tasdiqlash kodi to'g'ri kiritilgan
                    if (password) {
                        // Parolni SHA-256 heshlash
                        const passwordHash = crypto.createHash('sha256').update(password).digest('hex');
                        user.password = passwordHash;
                        // Yangilangan parolni saqlash
                        yield user.save();
                        // Tasdiqlash kodi bilan saqlangan ma'lumotni o'chirish
                        yield deleteRedisData(email);
                        const token = JWT.SIGN({ id: user._id });
                        res.status(200).json({
                            success: true,
                            token,
                            message: "Parol muvaffaqiyatli yangilandi",
                        });
                    }
                    else {
                        // Tasdiqlash kodi bilan saqlangan ma'lumotni o'chirish
                        yield deleteRedisData(email);
                        res.status(200).json({
                            success: true,
                            message: "Tasdiqlash kodi muvaffaqiyatli o'chirildi",
                        });
                    }
                }
            }
            catch (error) {
                handleError(res, error);
            }
        });
    }
}
export default new UserController();
