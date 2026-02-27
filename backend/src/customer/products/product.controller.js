import {
    getAllProducts,
    getProductsByShop,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    updateProductStock,
    getProductStats
} from './product.service.js';
import {uploadToImgBB} from "@/utils/imgbb.js";

export const getProducts = async (req, res) => {
    try {
        const filters = {
            shopId: req.query.shopId,
            categoryId: req.query.categoryId,
            available: req.query.available,
            search: req.query.search,
            page: req.query.page || 1,
            limit: req.query.limit || 10
        };

        const result = await getAllProducts(filters);

        res.status(200).json({
            success: true,
            data: result.products,
            pagination: result.pagination
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des produits',
            error: error.message
        });
    }
};

export const getShopProducts = async (req, res) => {
    try {
        const { shopId } = req.params;
        const filters = {
            categoryId: req.query.categoryId,
            available: req.query.available,
            search: req.query.search,
            page: req.query.page || 1,
            limit: req.query.limit || 10
        };

        const result = await getProductsByShop(shopId, filters);

        res.status(200).json({
            success: true,
            data: result.products,
            pagination: result.pagination
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des produits',
            error: error.message
        });
    }
};

export const getProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await getProductById(id);

        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        const statusCode = error.message === 'Produit non trouvé' ? 404 : 500;
        res.status(statusCode).json({
            success: false,
            message: error.message
        });
    }
};

export const addProduct = async (req, res) => {
    try {
        console.log('--- DEBUG MULTER ---');
        console.log('req.file       :', req.file ? req.file.originalname : 'AUCUN FICHIER');
        console.log('req.body       :', req.body);
        console.log('req.body keys  :', Object.keys(req.body));

        const file = req.file;

        let fileUrl = "https://i.ibb.co/BVp2cd60/default-image.png";
        if (file) {
            const imagePath = file.path;
            fileUrl = await uploadToImgBB(imagePath);
        }
        const productData = {
            name: req.body.name,
            price: req.body.price,
            shortDescription: req.body.shortDescription,
            stock: req.body.stock,
            shop: req.body.shop,
            category: req.body.category,
            photo: fileUrl
        };

        console.log('Product data final :', productData);

        const newProduct = await createProduct(productData);

        res.status(201).json({
            success: true,
            message: 'Produit créé avec succès',
            data: newProduct
        });
    } catch (error) {
        console.error('Erreur création produit:', error);
        res.status(400).json({
            success: false,
            message: 'Erreur lors de la création du produit',
            error: error.message
        });
    }
};

export const updateProductController = async (req, res) => {
    try {
        const { id } = req.params;

        const file = req.file;
        if(file){
            const imagePath = file.path;
            let fileUrl = await uploadToImgBB(imagePath);
            req.body.photo = fileUrl;
        }

        const updateData = {
            ...req.body
        };

        const updatedProduct = await updateProduct(id, updateData);

        res.status(200).json({
            success: true,
            message: 'Produit mis à jour avec succès',
            data: updatedProduct
        });
    } catch (error) {
        const statusCode = error.message === 'Produit non trouvé' ? 404 : 400;
        res.status(statusCode).json({
            success: false,
            message: error.message
        });
    }
};

export const deleteProductController = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await deleteProduct(id);

        res.status(200).json({
            success: true,
            message: result.message
        });
    } catch (error) {
        const statusCode = error.message === 'Produit non trouvé' ? 404 : 500;
        res.status(statusCode).json({
            success: false,
            message: error.message
        });
    }
};

export const updateStock = async (req, res) => {
    try {
        const { id } = req.params;
        const { stock } = req.body;

        if (stock === undefined || stock < 0) {
            return res.status(400).json({
                success: false,
                message: 'Stock invalide'
            });
        }

        const updatedProduct = await updateProductStock(id, stock);

        res.status(200).json({
            success: true,
            message: 'Stock mis à jour avec succès',
            data: updatedProduct
        });
    } catch (error) {
        const statusCode = error.message === 'Produit non trouvé' ? 404 : 400;
        res.status(statusCode).json({
            success: false,
            message: error.message
        });
    }
};

export const getStats = async (req, res) => {
    try {
        const { shopId } = req.params;
        const stats = await getProductStats(shopId);

        res.status(200).json({
            success: true,
            data: stats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des statistiques',
            error: error.message
        });
    }
};

export const getCategories = async (req, res) => {
    try {
        const Category = require('./category.model.js');
        const categories = await Category.find();
        res.status(200).json({
            success: true,
            data: categories
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des categories',
            error: error.message
        });
    }
};