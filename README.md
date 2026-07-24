# MediFind – Real-Time Medicine Finder & Home Delivery Platform (Full-Stack MVP)

[![MediFind CI/CD & Automated E2E Testing Pipeline](https://github.com/Sanjeeva2431/medifind/actions/workflows/deploy-and-test.yml/badge.svg)](https://github.com/Sanjeeva2431/medifind/actions/workflows/deploy-and-test.yml)
[![Appium Mobile Excel Analysis Pipeline](https://github.com/Sanjeeva2431/medifind/actions/workflows/appium-mobile-excel.yml/badge.svg)](https://github.com/Sanjeeva2431/medifind/actions/workflows/appium-mobile-excel.yml)
[![Baseline Load Test Excel Analysis Pipeline](https://github.com/Sanjeeva2431/medifind/actions/workflows/baseline-load-excel.yml/badge.svg)](https://github.com/Sanjeeva2431/medifind/actions/workflows/baseline-load-excel.yml)
[![Python Appium Excel Analysis Pipeline](https://github.com/Sanjeeva2431/medifind/actions/workflows/python-appium-excel.yml/badge.svg)](https://github.com/Sanjeeva2431/medifind/actions/workflows/python-appium-excel.yml)
[![Selenium Web Excel Analysis Pipeline](https://github.com/Sanjeeva2431/medifind/actions/workflows/selenium-web-excel.yml/badge.svg)](https://github.com/Sanjeeva2431/medifind/actions/workflows/selenium-web-excel.yml)

MediFind is a full-stack real-time medicine availability, price comparison, prescription OCR reading, and home delivery platform (Zomato for medicines).

---

## 🚀 Full-Stack Features Summary

- **Dedicated Customer Application**: Focused medicine search, price comparison, pharmacy discovery, prescription upload OCR, order checkout, and live GPS delivery tracking.
- **Node.js Express REST API**: Auth JWT endpoints, Medicine catalog search & CRUD, Pharmacy management, Orders creation & status updates, Prescriptions, Admin analytics.
- **Real-Time Engine**: Socket.IO websockets for instant live order status changes, driver location tracking, and stock notifications.
- **Database Engine**: Mongoose OR fall-back memory engine populating 100+ medicines, 20 pharmacies, 50 users, 15 delivery partners.
- **AI Features**: AI Prescription Reader (OCR), AI Healthcare Chatbot, Generic Alternatives Recommender with price savings.
- **DevOps Ready**: Dockerfile, `docker-compose.yml`, `.env.example`, seed initialization script.
- **Automated Testing Suite**: 470 Selenium Web E2E test cases, 430 Android Appium mobile E2E test cases, multi-format Excel workbooks, interactive HTML report dashboards, and live GitHub Pages deployment.

---

## 🛠️ API Documentation

### Auth APIs (`/api/auth`)
- `POST /api/auth/register`: Register new user account.
- `POST /api/auth/login`: Authenticate user and issue JWT Bearer token.
- `GET /api/auth/profile`: Get logged-in user profile details.

### Medicine APIs (`/api/medicines`)
- `GET /api/medicines`: List all medicines with optional search and category filters.
- `GET /api/medicines/:id`: Get detailed medicine specification.
- `POST /api/medicines`: Add new medicine to inventory (Pharmacy role).
- `PUT /api/medicines/:id`: Edit medicine price, stock, or dosage.
- `DELETE /api/medicines/:id`: Delete medicine from inventory.

### Pharmacy APIs (`/api/pharmacies`)
- `GET /api/pharmacies`: Get nearby verified pharmacies list.
- `GET /api/pharmacies/:id`: Get pharmacy details and inventory catalog.

### Order APIs (`/api/orders`)
- `GET /api/orders`: Get orders for user or pharmacy.
- `POST /api/orders`: Place new medicine order.
- `PUT /api/orders/:id/status`: Update order status (`Order Placed`, `Preparing`, `Out for Delivery`, `Delivered`).

---

## 💻 Running the Application

### Option 1: Node.js Directly
```bash
# Start full-stack server
node backend/server.js
```
Open **`http://localhost:5000`** in your browser.

### Option 2: Docker Compose
```bash
docker-compose up --build
```
Open **`http://localhost:5000`** in your browser.
