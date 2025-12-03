# GemTrack Developer Guide

## Overview
GemTrack is a modern jewelry stock management system built with a React (Next.js) frontend and a Node.js (Express) backend. It features a classy, dark-themed UI, real-time gold rate integration, and comprehensive inventory and sales management.

## Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS, Shadcn UI, Framer Motion
- **State Management**: React Hooks
- **Data Fetching**: Axios
- **Charts**: Recharts
- **PDF Generation**: jsPDF, jsPDF-AutoTable

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL (via Prisma ORM)
- **Authentication**: JWT (JSON Web Tokens)
- **External APIs**: GoldAPI.io

## Project Structure

### Frontend (`/frontend`)
- `app/`: Next.js App Router pages.
    - `dashboard/`: Protected dashboard routes (Inventory, Sales, POS).
    - `login/`, `signup/`: Authentication pages.
- `components/`: Reusable UI components (Shadcn UI).
- `utils/`: Helper functions and API services.
    - `api.js`: Centralized API configuration.
    - `pdfGenerator.js`: Invoice generation logic.

### Backend (`/backend`)
- `src/`: Source code.
    - `controllers/`: Business logic for routes.
    - `routes/`: API endpoint definitions.
    - `middlewares/`: Auth and error handling middlewares.
    - `prismaClient.js`: Database client instance.
- `prisma/`: Database schema (`schema.prisma`) and migrations.

## Key Features & Implementation Details

### 1. Dark Mode & Theming
- Implemented using `next-themes`.
- Colors are defined in `frontend/app/globals.css` using CSS variables for semantic naming (e.g., `--background`, `--foreground`).
- A "Classy Slate & Gold" palette is used to give a premium feel.

### 2. Gold API Integration
- **Backend**: `marketController.js` fetches live rates from `goldapi.io`.
- **Frontend**: Dashboard and POS pages fetch these rates to display live prices and calculate item values dynamically.
- **Fallback**: If the API fails or quota is exceeded, the system returns `null` to avoid showing incorrect data.

### 3. Point of Sale (POS)
- **Dynamic Pricing**: Item prices are recalculated in real-time based on the live gold rate, weight, and making charges.
- **Discount**: Supports applying discounts at checkout.
- **Invoice**: Generates a professional PDF invoice with all details.

### 4. Inventory Management
- **Barcode**: Generates PDF barcodes for items using `jsbarcode`.
- **Tracking**: Tracks item status (`isSold`) to ensure accurate inventory counts.

## Setup & Running

1.  **Database**: Ensure MySQL is running and the connection string is set in `backend/.env`.
2.  **Backend**:
    ```bash
    cd backend
    npm install
    npx prisma generate
    npx prisma migrate deploy
    npm run dev
    ```
3.  **Frontend**:
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

## Common Issues & Fixes

-   **Gold Rate NaN**: Usually due to API quota limits. Check `backend/src/controllers/marketController.js` logic.
-   **PDF Fonts**: If PDF generation fails, check `jspdf` font imports in `pdfGenerator.js`.
-   **CORS**: If frontend cannot talk to backend, check `cors` configuration in `backend/src/index.js`.

## Future Improvements
-   **Low Stock Alerts**: Implement email/SMS notifications for low inventory.
-   **User Roles**: Add 'Manager' and 'Staff' roles with different permissions.
-   **Backup**: Automated database backups.
