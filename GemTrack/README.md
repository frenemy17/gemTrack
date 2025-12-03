# GemTrack - Mobile Point of Sale (mPOS) for Jewelry

Complete, production-ready mobile POS application for jewelry retail management.

## 🚀 Features

### Core mPOS Functionality
- **Barcode Scanning**: Instant item lookup via camera
- **Customer Management**: Quick search & inline customer creation
- **Smart Checkout**: Multi-payment methods, credit sales support
- **Digital Receipts**: Professional PDF invoices with WhatsApp/Email sharing

### Business Intelligence
- **Live Market Rates**: Real-time gold/silver prices
- **Sales Analytics**: Trend charts and revenue tracking
- **Customer CRM**: Purchase history and outstanding dues
- **Inventory Control**: Advanced filtering and search

### Mobile-First Design
- Touch-optimized UI with large buttons
- Swipe gestures and bottom sheets
- Haptic feedback for confirmations
- Pull-to-refresh everywhere

## 📱 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm start

# Run on device
# Press 'i' for iOS simulator
# Press 'a' for Android emulator
# Scan QR with Expo Go app for physical device
```

## ⚙️ Configuration

Edit `src/services/config.js`:

```javascript
export const API_URL = 'http://YOUR_IP:3001/api';
export const SHOP_NAME = 'Your Shop Name';
export const SHOP_GSTIN = 'Your GSTIN';
```

**Important**: For physical devices, use your computer's IP address instead of `localhost`.

## 🎯 mPOS Workflow

1. **Start Sale**: Tap "Scan Item" button
2. **Scan Barcode**: Camera opens, scan item tag
3. **Select Customer**: Modal appears - search or quick-add
4. **Review Cart**: Add more items or proceed
5. **Payment**: Enter amount, select method (Cash/Card/UPI)
6. **Complete**: PDF invoice generated and shared

## 📂 Project Structure

```
src/
├── screens/          # All app screens
│   ├── LoginScreen.js
│   ├── POSScreen.js  # Core mPOS logic
│   ├── DashboardScreen.js
│   ├── InventoryScreen.js
│   └── CustomersScreen.js
├── navigation/       # Navigation setup
├── services/         # API client & config
├── components/       # Reusable components
│   └── CustomerModal.js
├── utils/           # Helpers & PDF generator
└── context/         # Auth context
```

## 🔐 Security

- JWT tokens stored in AsyncStorage
- Automatic token refresh on 401
- Secure API communication

## 📊 Backend Integration

Connects to Node.js/Express/MySQL backend with endpoints:
- `/auth/*` - Authentication
- `/items/*` - Inventory management
- `/sales/*` - Sales & checkout
- `/customers/*` - Customer CRM
- `/dashboard/*` - Analytics
- `/market/*` - Live rates

## 🏗️ Production Build

```bash
# iOS
eas build --platform ios

# Android
eas build --platform android
```

## 📝 License

Proprietary - All rights reserved
