var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import fs from 'fs';
import path from 'path';
export function uploadImg(req, res, title) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const uploadedFile = (_a = req.files) === null || _a === void 0 ? void 0 : _a.file;
        const contentType = req.headers['content-type'];
        if (!contentType || !contentType.includes('multipart/form-data')) {
            return res.status(400).json({ error: 'Fayl tipi noto\'g\'ri' });
        }
        if (!uploadedFile) {
            return res.status(400).json({ error: 'Fayl yuklanmagan' });
        }
        // Faylni "public/img" papkasiga saqlash
        const fileExt = path.extname(uploadedFile.name); // Fayl kengaytmasini aniqlash
        const allowedExtensions = ['.jpg', '.png', '.jpeg']; // Qabul qilingan fayl kengaytmalari
        let dynamicFileName = `${title}-${Date.now()}`; // Fayl nomi
        if (allowedExtensions.includes(fileExt.toLowerCase())) {
            dynamicFileName += fileExt;
        }
        else {
            return res.status(400).json({ error: 'Fayl formati qo\'llanilganlardan farq qiladi' });
        }
        const imgDir = path.join(process.cwd(), 'src', 'public', 'img');
        if (fs.existsSync(imgDir)) {
            try {
                yield uploadedFile.mv(path.join(imgDir, dynamicFileName));
                const img_link = `/img/${dynamicFileName}`; // Fayl manzili
                return img_link;
            }
            catch (error) {
                return res.status(500).json({ error: 'Faylni saqlashda xatolik yuz berdi' });
            }
        }
    });
}
