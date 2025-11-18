# 💎 GemTrack
### A Comprehensive Mobile POS & Inventory System for Jewelers

![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)

## 📖 Overview

**GemTrack** empowers small-scale jewelers to manage their entire business from a smartphone.

Currently, jewelers are forced to choose between **desktop POS systems** (powerful but immobile) and **basic mobile apps** (too simplistic for jewelry specifics). GemTrack bridges this gap by providing a professional-grade Point of Sale (POS) and inventory system in a native mobile application.

It handles complex jewelry data—such as **HUID, Wastage, Making Charges, and Stone Charges**—while allowing the owner to manage stock, customers, and sales from anywhere.

---

## 🚀 Key Features

### 🛡️ Authentication & Security
* Secure User Registration & Login.
* **JWT-based** authentication for all protected routes.

### 💍 Advanced Inventory Management
* **Deep Detail Tracking:** Supports HUID, SKU, Purity, Gross/Net Weight, Making Charges, Wastage %, GST %, and Stone Charges.
* **Image Uploads:** Capture and store product images directly from the phone camera.
* **Hardware Integration:** Scan Item SKU/HUID via mobile camera for instant lookup.

### 👥 Customer & Sales Management
* **Customer Profiles:** Manage Name, Phone, Email, Address, and PAN Card details.
* **Mobile POS:** Create new sales (Checkout) and automatically update inventory.
* **Sales History:** View past transactions with filtering options.

### 📊 Business Intelligence
* **Dashboard:** Real-time view of total sales and total inventory value.
* **Market Insights:** Live gold and silver market rates.

### ⚡ Performance & Scalability (Core Data Handling)
> *Designed to handle 10,000+ items instantly.*
* **Pagination:** All data-heavy lists (Inventory, Customers, History) are paginated at the API level.
* **Server-Side Search:** Fast searching by Name, Phone, SKU, or HUID.
* **Sorting & Filtering:** Dynamic sorting (e.g., by Weight) and filtering (e.g., by Date Range, Purity).

---

## 🛠️ Tech Stack

| Component | Technology |
| :--- | :--- |
| **Frontend** | React Native (Expo), React Navigation, Axios |
| **Backend** | Node.js, Express.js |
| **Database** | MySQL (Relational), Prisma ORM |
| **Auth** | JSON Web Tokens (JWT), bcrypt.js |
| **Hosting** | Render (Backend), TiDB/Aiven (DB), App Stores (Client) |

---

## 🏗️ System Architecture

The system follows a classic Client-Server architecture:

```mermaid
graph LR
    A[Mobile Client\nReact Native] -- REST API --> B[Backend Server\nNode.js + Express]
    B -- Prisma ORM --> C[Database\nMySQL]
