// MediFind Master Full-Stack Server (Express REST API + Socket.IO WebSockets)

import 'dotenv/config';
import express from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import { Server as SocketIOServer } from 'socket.io';

// Models & Stores
import { UserStore } from './models/User.js';
import { PharmacyStore } from './models/Pharmacy.js';
import { MedicineStore } from './models/Medicine.js';
import { OrderStore } from './models/Order.js';
import { PrescriptionStore } from './models/Prescription.js';

// Controllers
import { authController } from './controllers/authController.js';
import { medicineController } from './controllers/medicineController.js';
import { pharmacyController } from './controllers/pharmacyController.js';
import { orderController } from './controllers/orderController.js';
import { prescriptionController } from './controllers/prescriptionController.js';

// Routes
import { createAuthRoutes } from './routes/authRoutes.js';
import { createMedicineRoutes } from './routes/medicineRoutes.js';
import { createPharmacyRoutes } from './routes/pharmacyRoutes.js';
import { createOrderRoutes } from './routes/orderRoutes.js';
import { createPrescriptionRoutes } from './routes/prescriptionRoutes.js';

// Socket Handler
import { initSocketHandler } from './socket/socketHandler.js';

// Seed Initializer
import { seedDatabase } from './seed/seed.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
    cors: { origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE'] }
});

const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend static files
app.use(express.static(rootDir));

// Initialize Stores & Seed
const userStore = new UserStore();
const pharmacyStore = new PharmacyStore();
const medicineStore = new MedicineStore();
const orderStore = new OrderStore();
const prescriptionStore = new PrescriptionStore();

seedDatabase(userStore, pharmacyStore, medicineStore, orderStore, prescriptionStore);

// Controllers
const authCtrl = authController(userStore);
const medCtrl = medicineController(medicineStore);
const pharmCtrl = pharmacyController(pharmacyStore);
const orderCtrl = orderController(orderStore, io);
const prescriptionCtrl = prescriptionController(prescriptionStore);

// API Routes
app.use('/api/auth', createAuthRoutes(authCtrl));
app.use('/api/medicines', createMedicineRoutes(medCtrl));
app.use('/api/pharmacies', createPharmacyRoutes(pharmCtrl));
app.use('/api/orders', createOrderRoutes(orderCtrl));
app.use('/api/prescriptions', createPrescriptionRoutes(prescriptionCtrl));

// Health Check API
app.get('/api/health', (req, res) => {
    res.json({
        status: 'UP',
        app: 'MediFind Full-Stack Engine',
        timestamp: new Date().toISOString(),
        medicinesCount: medicineStore.getAll().length,
        pharmaciesCount: pharmacyStore.getAll().length,
        ordersCount: orderStore.getAll().length
    });
});

// Admin Stats API
app.get('/api/admin/stats', (req, res) => {
    const orders = orderStore.getAll();
    const totalRevenue = orders.reduce((sum, o) => sum + o.total_amount, 0);
    res.json({
        success: true,
        stats: {
            totalRevenue,
            totalOrders: orders.length,
            activePharmacies: pharmacyStore.getAll().length,
            totalMedicines: medicineStore.getAll().length,
            totalUsers: userStore.getAll().length
        }
    });
});

// Socket.IO Websocket Connection
initSocketHandler(io, orderStore);

// Start Server
server.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🏥 MediFind Full-Stack Server Running on Port ${PORT}`);
    console.log(`🌐 Local Web URL: http://localhost:${PORT}`);
    console.log(`⚡ REST APIs & Socket.IO Engine Initialized`);
    console.log(`=======================================================`);
});
