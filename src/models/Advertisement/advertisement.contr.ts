import express, { Request, Response } from 'express';
import advertisementModel from './advertisement.model.js';
import { IAdvertisement, IVideoInfo } from './advertisement.interface.js';
import handleError from '../../utils/catchError.js';
import { uploadImg } from '../../utils/uploadImg.js';
import fs from 'fs';
import path from 'path';
class advertisementController {
    // Create a new advertisement
    public createAdvertisement = async (req: Request, res: Response): Promise<void> => {
        try {
            let {
                title,
                description,
                url
            }: IVideoInfo = req.body;

            if (!title || !description || !url) {
                res.status(400).json({ error: 'title, description, va url talab qilinadi' });
            }
            let img_link = await uploadImg(req, res, title)
            const advertisement: IAdvertisement = new advertisementModel({
                title,
                description,
                url,
                img_link
            });
            const savedAdvertisement = await advertisement.save();
            res.status(201).send({
                success: true,
                data: savedAdvertisement
            });
        } catch (error: any) {
            handleError(res, error)
        }
    };
    // Get all advertisements
    public gatAllAdvertisements = async (req: Request, res: Response): Promise<void> => {
        try {
            const advertisements = await advertisementModel.find().sort({ _id: -1 }).limit(3).exec();;
            res.status(200).json(advertisements);
        } catch (error: any) {
            handleError(res, error)
        }
    };

    // Get advertisement by ID
    public gatAdvertisementById = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;
        try {
            const advertisement = await advertisementModel.findById(id);
            if (!advertisement) {
                res.status(404).json({ error: 'advertisement not found' });
                return;
            }
            res.status(200).json(advertisement);
        } catch (error: any) {
            handleError(res, error)
        }
    };

    // Update advertisement by ID
    public updateAdvertisement = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params; // Reklamaning identifikatsiyonini olish
    
            // Reklama ma'lumotlarini olish
            let advertisement: IAdvertisement | null = await advertisementModel.findById(id);
            if (!advertisement) {
                res.status(404).json({ error: 'Reklama topilmadi' });
            }
    
            // Yangi ma'lumotlarni olish
            const {
                title,
                description,
                url,
            }: IVideoInfo = req.body;
    
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
                let img_link: string | any = await uploadImg(req, res, title);
                if (advertisement) {
                    // Reklama ma'lumotlarini yangilash
                    advertisement.title = title ? title : advertisement.title;
                    advertisement.description = description ? description : advertisement.description;
                    advertisement.url = url ? url : advertisement.url;
                    advertisement.img_link = img_link;
                }
            } else {
                // Fayl yuklanmagan holatda faqat ma'lumotlarni yangilash
                if (advertisement) {
                    advertisement.title = title ? title : advertisement.title;
                    advertisement.description = description ? description : advertisement.description;
                    advertisement.url = url ? url : advertisement.url;
                }
            }
    
            // Yangilangan reklamani saqlash
            if (advertisement) {
                const updatedAdvertisement = await advertisement.save();
                res.status(200).json({
                    success: true,
                    data: updatedAdvertisement,
                });
            }
        } catch (error: any) {
            handleError(res, error);
        }
    };
    
    


    // Delete advertisement by ID
    public deleteAdvertisement = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params; // O'chiriladigan reklamaning identifikatsiyonini olish

            // Reklama ma'lumotlarini olish
            const advertisement = await advertisementModel.findById(id);

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
            await advertisementModel.findByIdAndDelete(id);

            res.status(204).json(); // 204-status kodi bilan ma'lumotlar yuboriladi (ma'lumotlar yo'q o'chirilgan)
        } catch (error: any) {
            handleError(res, error);
        }
    };

}

export default new advertisementController();
