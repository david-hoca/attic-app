import express, { Request, Response } from 'express';
import advertisementModel from './advertisement.model.js';
import { IAdvertisement } from './advertisement.interface.js';
import handleError from '../../utils/catchError.js';

class advertisementController {
    // Create a new advertisement
    public createAdvertisement = async (req: Request, res: Response): Promise<void> => {
        try {
            const advertisement: IAdvertisement = new advertisementModel(req.body);
            const savedAdvertisement = await advertisement.save();
            res.status(201).json(savedAdvertisement);
        } catch (error: any) {
            handleError(res, error)
        }
    };

    // Get all advertisements
    public gatAllAdvertisements = async (req: Request, res: Response): Promise<void> => {
        try {
            const advertisements = await advertisementModel.find();
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
        const { id } = req.params;
        try {
            const adatedIAdvertisement = await advertisementModel.findByIdAndUpdate(id, req.body, { new: true });
            if (!adatedIAdvertisement) {
                res.status(404).json({ error: 'advertisement not found' });
                return;
            }
            res.status(200).json(adatedIAdvertisement);
        } catch (error: any) {
            handleError(res, error)
        }
    };

    // Delete advertisement by ID
    public deleteAdvertisement = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;
        try {
            const aletedIAdvertisement = await advertisementModel.findByIdAndDelete(id);
            if (!aletedIAdvertisement) {
                res.status(404).json({ error: 'advertisement not found' });
                return;
            }
            res.status(204).send();
        } catch (error: any) {
            handleError(res, error)
        }
    };
}

export default new advertisementController();
