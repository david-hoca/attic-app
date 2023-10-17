var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import mongoose from "mongoose";
import path from "path/posix";
import Store from "./store.schema.js";
import catSchema from "../category/cat.schema.js";
import fs from "fs";
export default {
    post(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Extract data from the request body
                const { storeTitle, phone, location, categoryId } = req.body;
                // Check if a file (storeLogo) was uploaded
                if (!storeTitle || !phone || !location || !categoryId) {
                    return res.status(400).json({ message: "Invalid data" });
                }
                if (!req.files || !req.files.storeLogo) {
                    return res.status(400).json({ message: "Store logo is required" });
                }
                if (!mongoose.isValidObjectId(categoryId)) {
                    return res.status(400).json({ message: "Invalid category" });
                }
                let categoryData = yield catSchema.findById(categoryId);
                if (!categoryData) {
                    return res.status(400).json({ message: "Invalid category" });
                }
                const allowedExtensions = [".jpg", ".jpeg", ".png"];
                // Get the uploaded file (storeLogo)
                const storeLogo = req.files.storeLogo;
                const ext = path.extname(storeLogo.name).toLowerCase();
                if (!allowedExtensions.includes(ext)) {
                    return res
                        .status(400)
                        .json({ message: "Only JPEG and PNG image files are allowed" });
                }
                const newStore = new Store({
                    storeTitle,
                    phone,
                    location,
                    category: categoryId,
                });
                let uploadPath = process.cwd() + "/src/public/storeLogos/" + newStore._id + ext;
                yield storeLogo.mv(uploadPath, (error) => {
                    if (error) {
                        console.log(error);
                        throw new Error(error);
                    }
                });
                newStore.storeLogo = "/storeLogos/" + newStore._id + ext;
                const savedStore = yield newStore.save();
                yield catSchema.findByIdAndUpdate(categoryId, {
                    $push: {
                        stores: newStore._id,
                    },
                });
                const populatedStore = yield Store.populate(savedStore, {
                    path: "category",
                });
                res.json({
                    data: populatedStore,
                });
            }
            catch (error) {
                console.error("Error creating store:", error);
                res.status(500).json({ message: "Internal server error" });
            }
        });
    },
    getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const storeId = req.params.id; // Get the store ID from the request parameters
                // Find the store by ID
                const store = yield Store.findById(storeId).populate("category");
                if (!store) {
                    return res.status(404).json({ message: "Store not found" });
                }
                res.status(200).json({ data: store }); // Respond with the store data
            }
            catch (error) {
                console.error("Error getting store by ID:", error);
                res.status(500).json({ message: "Internal server error" });
            }
        });
    },
    getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Find all stores in the database
                const stores = yield Store.find().populate("category");
                res.status(200).json({ data: stores }); // Respond with the array of store data
            }
            catch (error) {
                console.error("Error getting all stores:", error);
                res.status(500).json({ message: "Internal server error" });
            }
        });
    },
    put(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { categoryId } = req.body;
                let storeId = req.params.id;
                let newStore = yield Store.findById(storeId);
                let dataFields = ["storeTitle", "phone", "location"];
                dataFields.forEach((e) => {
                    if (req.body[e]) {
                        newStore[e] = req.body[e];
                    }
                });
                if (categoryId && !mongoose.isValidObjectId(categoryId)) {
                    return res.status(400).json({ message: "Invalid category" });
                }
                else if (categoryId) {
                    let categoryData = yield catSchema.findById(categoryId);
                    if (!categoryData) {
                        return res.status(400).json({ message: "Invalid category" });
                    }
                    newStore.category = categoryId;
                }
                const allowedExtensions = [".jpg", ".jpeg", ".png"];
                // Get the uploaded file (storeLogo)
                const storeLogo = (_a = req.files) === null || _a === void 0 ? void 0 : _a.storeLogo;
                if (storeLogo) {
                    const ext = path.extname(storeLogo.name).toLowerCase();
                    if (!allowedExtensions.includes(ext)) {
                        return res
                            .status(400)
                            .json({ message: "Only JPEG and PNG image files are allowed" });
                    }
                    allowedExtensions.forEach((e) => __awaiter(this, void 0, void 0, function* () {
                        yield fs.unlink(process.cwd() + "/src/public/storeLogos/" + newStore._id + e, (err) => { });
                    }));
                    let uploadPath = process.cwd() + "/src/public/storeLogos/" + newStore._id + ext;
                    yield storeLogo.mv(uploadPath, (error) => {
                        if (error) {
                            console.log(error);
                            throw new Error(error);
                        }
                    });
                    newStore.storeLogo = "/storeLogos/" + newStore._id + ext;
                }
                const savedStore = yield newStore.save();
                const populatedStore = yield Store.populate(savedStore, {
                    path: "category",
                });
                res.json({
                    data: populatedStore,
                });
            }
            catch (error) {
                console.error("Error creating store:", error);
                res.status(500).json({ message: "Internal server error" });
            }
        });
    },
    del(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const storeId = req.params.id; // Get the store ID from the request parameters
                const allowedExtensions = [".jpg", ".jpeg", ".png"];
                allowedExtensions.forEach((e) => __awaiter(this, void 0, void 0, function* () {
                    yield fs.unlink(process.cwd() + "/src/public/storeLogos/" + storeId + e, (err) => { });
                }));
                // Find the store by ID
                const store = yield Store.findByIdAndDelete(storeId);
                res.status(200).json({ message: "Store deleted" }); // Respond with the store data
            }
            catch (error) {
                console.error("Error deleting store by ID:", error);
                res.status(500).json({ message: "Internal server error" });
            }
        });
    },
};
