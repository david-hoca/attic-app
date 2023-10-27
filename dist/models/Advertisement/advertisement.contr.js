var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import advertisementModel from './advertisement.model.js';
import handleError from '../../utils/catchError.js';
import { uploadImg } from '../../utils/uploadImg.js';
import fs from 'fs';
import path from 'path';
class advertisementController {
    constructor() {
        // Create a new advertisement
        this.createAdvertisement = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let { title, description, url } = req.body;
                if (!title || !description || !url) {
                    res.status(400).json({ error: 'title, description, va url talab qilinadi' });
                }
                let img_link = yield uploadImg(req, res, title);
                const advertisement = new advertisementModel({
                    title,
                    description,
                    url,
                    img_link
                });
                const savedAdvertisement = yield advertisement.save();
                res.status(201).send({
                    success: true,
                    data: savedAdvertisement
                });
            }
            catch (error) {
                handleError(res, error);
            }
        });
        // Get all advertisements
        this.gatAllAdvertisements = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const advertisements = yield advertisementModel.find().sort({ _id: -1 }).limit(3).exec();
                ;
                res.status(200).json(advertisements);
            }
            catch (error) {
                handleError(res, error);
            }
        });
        // Get advertisement by ID
        this.gatAdvertisementById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const advertisement = yield advertisementModel.findById(id);
                if (!advertisement) {
                    res.status(404).json({ error: 'advertisement not found' });
                    return;
                }
                res.status(200).json(advertisement);
            }
            catch (error) {
                handleError(res, error);
            }
        });
        // Update advertisement by ID
        this.updateAdvertisement = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params; // Reklamaning identifikatsiyonini olish
                // Reklama ma'lumotlarini olish
                let advertisement = yield advertisementModel.findById(id);
                if (!advertisement) {
                    res.status(404).json({ error: 'Reklama topilmadi' });
                }
                // Yangi ma'lumotlarni olish
                const { title, description, url, } = req.body;
                // Yangi fayl yuklanib kelgan bo'lsa
                if (req.files && req.files.file) {
                    // Eskiy rasimni o'chirib tashlash
                    if (advertisement && advertisement.img_link) {
                        const imgPath = path.join(process.cwd(), 'src', 'public', advertisement.img_link);
                        if (fs.existsSync(imgPath)) {
                            fs.unlinkSync(imgPath);
                        }
                    }
                    // Yangi rasimni yuklash va manzilini saqlash
                    let img_link = yield uploadImg(req, res, title);
                    if (advertisement) {
                        // Reklama ma'lumotlarini yangilash
                        advertisement.title = title ? title : advertisement.title;
                        advertisement.description = description ? description : advertisement.description;
                        advertisement.url = url ? url : advertisement.url;
                        advertisement.img_link = img_link;
                    }
                }
                else {
                    // Fayl yuklanmagan holatda faqat ma'lumotlarni yangilash
                    if (advertisement) {
                        advertisement.title = title ? title : advertisement.title;
                        advertisement.description = description ? description : advertisement.description;
                        advertisement.url = url ? url : advertisement.url;
                    }
                }
                // Yangilangan reklamani saqlash
                if (advertisement) {
                    const updatedAdvertisement = yield advertisement.save();
                    res.status(200).json({
                        success: true,
                        data: updatedAdvertisement,
                    });
                }
            }
            catch (error) {
                handleError(res, error);
            }
        });
        // Delete advertisement by ID
        this.deleteAdvertisement = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params; // O'chiriladigan reklamaning identifikatsiyonini olish
                // Reklama ma'lumotlarini olish
                const advertisement = yield advertisementModel.findById(id);
                if (!advertisement) {
                    res.status(404).json({ error: 'Reklama topilmadi' });
                }
                // Rasimni o'chirish
                if (advertisement) {
                    const imgPath = path.join(process.cwd(), 'src', 'public', advertisement.img_link);
                    if (fs.existsSync(imgPath)) {
                        fs.unlinkSync(imgPath);
                    }
                }
                // Reklamani o'chirish
                yield advertisementModel.findByIdAndDelete(id);
                res.status(204).json(); // 204-status kodi bilan ma'lumotlar yuboriladi (ma'lumotlar yo'q o'chirilgan)
            }
            catch (error) {
                handleError(res, error);
            }
        });
    }
}
export default new advertisementController();
