const Product = require('../models/Product');

// @desc    Fetch all products (with pagination & search/filter)
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
    try {
        const pageSize = 10;
        const page = Number(req.query.pageNumber) || 1;

        // Search query
        const keyword = req.query.keyword ? {
            name: {
                $regex: req.query.keyword,
                $options: 'i',
            },
        } : {};

        // Filters
        const category = req.query.category ? { category: req.query.category } : {};
        const brand = req.query.brand ? { brand: req.query.brand } : {};
        
        const filter = { ...keyword, ...category, ...brand };

        // Sort
        let sort = {};
        if (req.query.sort === 'price_asc') sort = { price: 1 };
        else if (req.query.sort === 'price_desc') sort = { price: -1 };
        else sort = { createdAt: -1 };

        const count = await Product.countDocuments(filter);
        const products = await Product.find(filter)
            .sort(sort)
            .limit(pageSize)
            .skip(pageSize * (page - 1));

        res.json({ products, page, pages: Math.ceil(count / pageSize) });
    } catch (error) {
        next(error);
    }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            res.json(product);
        } else {
            res.status(404);
            throw new Error('Product not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res, next) => {
    try {
        const { name, price, description, category, brand, stock } = req.body;
        
        let imageUrl = '';
        if (req.file) {
            imageUrl = `/uploads/${req.file.filename}`;
        } else {
            res.status(400);
            throw new Error('Image is required');
        }

        const product = new Product({
            name,
            price,
            description,
            imageUrl,
            brand,
            category,
            stock,
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        next(error);
    }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res, next) => {
    try {
        const { name, price, description, category, brand, stock } = req.body;

        const product = await Product.findById(req.params.id);

        if (product) {
            product.name = name || product.name;
            product.price = price || product.price;
            product.description = description || product.description;
            product.category = category || product.category;
            product.brand = brand || product.brand;
            product.stock = stock || product.stock;

            if (req.file) {
                product.imageUrl = `/uploads/${req.file.filename}`;
            }

            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404);
            throw new Error('Product not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            await product.deleteOne();
            res.json({ message: 'Product removed' });
        } else {
            res.status(404);
            throw new Error('Product not found');
        }
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
};
