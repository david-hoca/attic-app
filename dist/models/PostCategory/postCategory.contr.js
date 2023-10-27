var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import postCategory from "./postCategory.schema.js";
class PostCategoryController {
    constructor() {
        this.POST_CATEGORY_func = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { cat_name } = req.body;
                const PostCategory = new postCategory({ cat_name });
                const result = yield PostCategory.save();
                res.json(result);
            }
            catch (error) {
                res.status(400).json({ error: error.message });
            }
        });
        this.GET_CATEGORY_func = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield postCategory.find().populate('posts');
                res.json(result);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
        this.GET_CATEGORYBYID_func = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const result = yield postCategory.findById(id).populate('posts');
                ;
                res.json(result);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
        this.UPDATE_CATEGORY = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const { cat_name } = req.body;
                const result = yield postCategory.findByIdAndUpdate(id, { cat_name }, { new: true });
                res.json(result);
            }
            catch (error) {
                res.status(400).json({ error: error.message });
            }
        });
        this.DELETE_CATEGORY = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const result = yield postCategory.findByIdAndDelete(id);
                res.json(result);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
}
export default new PostCategoryController();
