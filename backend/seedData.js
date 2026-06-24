require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');
const Product = require('./src/models/Product');
const connectDB = require('./src/config/db');

const dummyProducts = [
    // Electronics
    { name: 'Wireless Bluetooth Headphones', price: 89.99, description: 'High-quality wireless headphones with noise cancellation.', category: 'Electronics', brand: 'AudioTech', stock: 50, imageUrl: '/uploads/dummy.png', rating: 4.5, numReviews: 12 },
    { name: 'Smart Home Security Camera', price: 129.99, description: '1080p HD smart camera with motion detection.', category: 'Electronics', brand: 'SecureHome', stock: 30, imageUrl: '/uploads/dummy.png', rating: 4.8, numReviews: 25 },
    { name: 'Mechanical Gaming Keyboard', price: 109.99, description: 'RGB backlit mechanical keyboard.', category: 'Electronics', brand: 'GamerGear', stock: 45, imageUrl: '/uploads/dummy.png', rating: 4.7, numReviews: 34 },
    { name: '4K Ultra HD Smart TV', price: 499.99, description: '55-inch 4K Smart TV with built-in streaming apps.', category: 'Electronics', brand: 'VisionTech', stock: 15, imageUrl: '/uploads/dummy.png', rating: 4.6, numReviews: 89 },
    { name: 'Smartphone Pro Max', price: 999.99, description: 'Latest smartphone with pro-grade camera system.', category: 'Electronics', brand: 'TechPro', stock: 25, imageUrl: '/uploads/dummy.png', rating: 4.9, numReviews: 150 },
    
    // Clothing
    { name: 'Minimalist Cotton T-Shirt', price: 19.99, description: 'Comfortable 100% cotton t-shirt.', category: 'Clothing', brand: 'UrbanWear', stock: 120, imageUrl: '/uploads/dummy.png', rating: 4.2, numReviews: 8 },
    { name: 'Classic Denim Jacket', price: 59.99, description: 'Vintage style denim jacket for all seasons.', category: 'Clothing', brand: 'DenimCo', stock: 40, imageUrl: '/uploads/dummy.png', rating: 4.6, numReviews: 45 },
    { name: 'Athletic Running Shoes', price: 79.99, description: 'Lightweight running shoes for maximum performance.', category: 'Clothing', brand: 'SpeedFit', stock: 60, imageUrl: '/uploads/dummy.png', rating: 4.4, numReviews: 67 },
    { name: 'Winter Puffer Coat', price: 119.99, description: 'Insulated puffer coat for extreme cold.', category: 'Clothing', brand: 'WinterGear', stock: 20, imageUrl: '/uploads/dummy.png', rating: 4.8, numReviews: 32 },

    // Home & Kitchen
    { name: 'Stainless Steel Water Bottle', price: 24.99, description: 'Vacuum insulated water bottle.', category: 'Home & Kitchen', brand: 'EcoFlask', stock: 200, imageUrl: '/uploads/dummy.png', rating: 4.9, numReviews: 45 },
    { name: 'Non-Stick Cookware Set', price: 149.99, description: '12-piece premium non-stick pots and pans set.', category: 'Home & Kitchen', brand: 'ChefMaster', stock: 35, imageUrl: '/uploads/dummy.png', rating: 4.7, numReviews: 112 },
    { name: 'Ceramic Coffee Mug', price: 14.99, description: 'Handcrafted ceramic mug for your morning brew.', category: 'Home & Kitchen', brand: 'ArtisanHome', stock: 80, imageUrl: '/uploads/dummy.png', rating: 4.5, numReviews: 23 },
    { name: 'Robot Vacuum Cleaner', price: 199.99, description: 'Smart robot vacuum with app control.', category: 'Home & Kitchen', brand: 'CleanBot', stock: 25, imageUrl: '/uploads/dummy.png', rating: 4.3, numReviews: 56 },

    // Books
    { name: 'Bestseller Fiction Novel', price: 14.99, description: 'The gripping new thriller.', category: 'Books', brand: 'Publisher Inc', stock: 100, imageUrl: '/uploads/dummy.png', rating: 4.1, numReviews: 50 },
    { name: 'Mastering JavaScript', price: 39.99, description: 'Comprehensive guide to modern web development.', category: 'Books', brand: 'TechPress', stock: 65, imageUrl: '/uploads/dummy.png', rating: 4.8, numReviews: 145 },
    { name: 'The Art of Cooking', price: 29.99, description: 'Recipe book featuring global cuisines.', category: 'Books', brand: 'CulinaryBooks', stock: 45, imageUrl: '/uploads/dummy.png', rating: 4.6, numReviews: 78 }
];

const seedData = async () => {
    try {
        await connectDB();

        await Product.deleteMany();
        console.log('Products cleared');

        await Product.insertMany(dummyProducts);
        console.log(`Inserted ${dummyProducts.length} dummy products`);

        const adminExists = await User.findOne({ email: 'admin@example.com' });
        if (!adminExists) {
            const admin = new User({
                name: 'Admin User',
                email: 'admin@example.com',
                password: 'password123',
                role: 'admin'
            });
            await admin.save();
            console.log('Admin user created (admin@example.com / password123)');
        }

        console.log('Data seeding completed successfully!');
        process.exit();
    } catch (error) {
        console.error('Error with data seeding', error);
        process.exit(1);
    }
};

seedData();
