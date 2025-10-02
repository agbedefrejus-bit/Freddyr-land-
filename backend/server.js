require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());
app.use(cors());

// Connexion MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/freddyland', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Modèles
const User = mongoose.model('User', new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, enum: ['admin', 'livreur', 'client'], default: 'client' },
    phone: String,
    createdAt: { type: Date, default: Date.now }
}));

const Product = mongoose.model('Product', new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    category: String,
    image: String,
    stock: Number,
    isActive: { type: Boolean, default: true }
}));

const Order = mongoose.model('Order', new mongoose.Schema({
    orderNumber: { type: String, unique: true },
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    products: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        name: String,
        quantity: Number,
        price: Number
    }],
    total: Number,
    status: { 
        type: String, 
        enum: ['en_attente', 'confirmé', 'en_preparation', 'en_livraison', 'livré', 'annulé'],
        default: 'en_attente'
    },
    deliveryAddress: {
        street: String,
        city: String,
        postalCode: String,
        country: String,
        instructions: String
    },
    clientPhone: String,
    assignedDriver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }
}));

// Routes de base
app.get('/api/health', (req, res) => {
    res.json({ 
        success: true,
        message: '🚀 API Freddy Land opérationnelle',
        timestamp: new Date().toISOString()
    });
});

// Authentification
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password, role, phone } = req.body;
        
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new User({ name, email, password: hashedPassword, role, phone });
        await user.save();
        
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET || 'freddyland_secret',
            { expiresIn: '30d' }
        );
        
        res.status(201).json({
            success: true,
            message: 'Compte créé avec succès',
            data: {
                token,
                user: { id: user._id, name, email, role, phone }
            }
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(400).json({ 
                success: false, 
                message: 'Utilisateur non trouvé' 
            });
        }
        
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ 
                success: false, 
                message: 'Mot de passe incorrect' 
            });
        }
        
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET || 'freddyland_secret',
            { expiresIn: '30d' }
        );
        
        res.json({
            success: true,
            message: 'Connexion réussie',
            data: {
                token,
                user: { 
                    id: user._id, 
                    name: user.name, 
                    email: user.email, 
                    role: user.role, 
                    phone: user.phone 
                }
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
});

// Données de test
app.post('/api/seed-data', async (req, res) => {
    try {
        await User.deleteMany({});
        await Product.deleteMany({});

        // Utilisateurs de test
        await User.create([
            {
                name: 'Admin Freddy',
                email: 'agbedefrejus@gmail.com',
                password: await bcrypt.hash('admin123', 12),
                role: 'admin',
                phone: '+2290157724014'
            },
            {
                name: 'Livreur Jean',
                email: 'livreur@freddyland.com',
                password: await bcrypt.hash('livreur123', 12),
                role: 'livreur',
                phone: '+33987654321'
            },
            {
                name: 'Client Test',
                email: 'client@freddyland.com',
                password: await bcrypt.hash('client123', 12),
                role: 'client',
                phone: '+33112233445'
            }
        ]);

        // Produits de test
        await Product.create([
            {
                name: "Pizza Royale",
                description: "Pizza avec jambon, fromage et champignons",
                price: 12.99,
                category: "Pizza",
                image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300",
                stock: 50
            },
            {
                name: "Burger Deluxe",
                description: "Burger avec steak haché, bacon et cheddar",
                price: 9.99,
                category: "Burger",
                image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300",
                stock: 30
            }
        ]);

        res.json({ 
            success: true, 
            message: 'Données de test créées avec succès' 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Serveur Freddy Land démarré sur le port ${PORT}`);
});
