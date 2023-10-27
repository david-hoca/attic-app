var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import catSchema from "./cat.schema.js";
export default {
    post(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { catName } = req.body;
                if (!catName || !catName.toString().trim()) {
                    return res.status(400).json({
                        message: "Category name is required.",
                    });
                }
                let newCategory = new catSchema({
                    catName: catName.toString().trim(),
                });
                yield newCategory.save();
                res.status(201).json({
                    data: newCategory,
                    message: "Category created successful",
                });
            }
            catch (error) {
                if (error.code == 11000) {
                    return res.status(400).json({
                        message: "Category name must be unique.",
                    });
                }
                res.status(500).json({
                    message: "Server error",
                    error: error.message,
                });
            }
        });
    },
    put(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { catName } = req.body;
                let catId = req.params.id;
                if (!catName || !catName.toString().trim()) {
                    return res.status(400).json({
                        message: "No data provided for update.",
                    });
                }
                yield catSchema.updateOne({ _id: catId }, { catName: catName.toString().trim() });
                let newCategory = yield catSchema.findById(catId);
                res.status(201).json({
                    data: newCategory,
                    message: "Category edited successful",
                });
            }
            catch (error) {
                if (error.code == 11000) {
                    return res.status(400).json({
                        message: "Category name must be unique.",
                    });
                }
                res.status(500).json({
                    message: "Server error",
                    error: error.message,
                });
            }
        });
    },
    getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let data = yield catSchema.find().populate("stores");
                res.json({ data });
            }
            catch (error) {
                res.status(500).json({
                    message: "Server error",
                    error: error.message,
                });
            }
        });
    },
    getOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let data = yield catSchema.findById(req.params.id).populate("stores");
                res.json({ data });
            }
            catch (error) {
                res.status(500).json({
                    message: "Server error",
                    error: error.message,
                });
            }
        });
    },
    del(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let data = yield catSchema.findByIdAndDelete(req.params.id);
                res.json({ message: "Category deleted." });
            }
            catch (error) {
                res.status(500).json({
                    message: "Server error",
                    error: error.message,
                });
            }
        });
    }
};
