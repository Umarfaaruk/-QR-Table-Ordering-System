# 🌶️ Café Spice — QR Table Ordering System

A production-quality, full-stack **QR Table Ordering System** demo for restaurants.
Customers scan a QR code at their table, order from their phone, and the order
appears **live** on the kitchen screen — no waiters, no waiting.

Built as a polished live demo to show restaurant owners.

> **Runs out of the box.** No Firebase project? The app automatically starts in
> **Demo Mode** with realistic mock data and simulated real-time order updates
> (a fresh order drops onto the kitchen board every 30 seconds). Connect Firebase
> later for real persistence and live sync across devices.

---

## ✨ Features

| Interface | Route | What it does |
|-----------|-------|--------------|
| 🏠 **Landing** | `/` | Product intro + entry points to all three demos |
| 📱 **Customer Menu** | `/menu/:tableId` | Swiggy/Zomato-quality mobile ordering. Categories, cart, special instructions, order confirmation |
| 👨‍🍳 **Kitchen Display** | `/kitchen` | Professional KDS — real-time order board, status flow, sound alerts, live clock |
| ⚙️ **Admin Panel** | `/admin` | Lightweight SaaS dashboard — menu management, QR generator, order history & revenue |

**Highlights**
- 🔴 **Real-time sync** via Firestore `onSnapshot` (orders flow from customer → kitchen instantly)
- 🔔 Subtle "ding" sound on the kitchen screen when a new order arrives (Web Audio — no asset needed)
- 🟢 Veg / non-veg indicators, ₹ pricing, item emojis
- 📲 QR code generation + **Print All** sheet for every table
- 🔐 Admin login (Firebase Auth, with a demo-mode fallback)
- 💀 Skeleton loaders, empty states, and toast error handling throughout
- 📱 Fully responsive — mobile-first customer menu, multi-column kitchen grid

---

## 🧱 Tech Stack

- **React 18 + TypeScript + Vite**
- **Tailwind CSS** for styling
- **Firebase Firestore** — real-time database
- **Firebase Auth** — admin login
- **react-router-dom** — routing
- **qrcode.react** — QR generation
- **react-hot-toast** — notifications
- **lucide-react** — icons

---

## 🚀 Getting Started

### 1. Install

```bash
npm install
```

### 2. Run (Demo Mode — zero config)

```bash
npm run dev
```

Open <http://localhost:5173>. That's it — explore all three interfaces with mock data.

Open `/kitchen` in one tab and `/menu/table-5` in another to watch an order you
place flow straight onto the kitchen board.

### 3. (Optional) Connect Firebase for real persistence

1. Create a project at <https://console.firebase.google.com>.
2. Add a **Web App** and copy the config.
3. Enable **Cloud Firestore** and **Email/Password Authentication**.
4. Copy the env template and fill it in:

   ```bash
   cp .env.example .env
   ```

   ```env
   VITE_FIREBASE_API_KEY=your-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=000000000000
   VITE_FIREBASE_APP_ID=1:000:web:abc123
   ```

5. Create an admin user in **Authentication → Users** (e.g. `admin@cafespice.com`).
6. Deploy the included Firestore rules:

   ```bash
   firebase deploy --only firestore:rules
   ```

Restart `npm run dev` — the app now uses your live Firebase backend.

> If any required env var is missing, the app silently falls back to Demo Mode.

---

## 🔑 Demo Credentials

Admin Panel login (Demo Mode):

```
Email:    admin@cafespice.com
Password: demo1234
```

On the login screen there's a one-tap **"autofill demo credentials"** button.

---

## 🗂️ Firestore Collections

| Collection | Written by | Read by | Shape |
|------------|------------|---------|-------|
| `orders` | Customer menu | Kitchen + Admin | `{ orderId, tableId, tableNumber, items[], totalAmount, status, specialInstructions, timestamp }` |
| `menuItems` | Admin | Customer menu | `{ name, description, price, category, isVeg, emoji }` |

**Order status flow:** `pending → preparing → ready → completed`

Security rules (see [`firestore.rules`](./firestore.rules)): public read on
`menuItems`, public create/read on `orders` (login-free demo), and admin auth
required for menu writes and order status updates.

---

## 📁 Project Structure

```
src/
  pages/
    Landing.tsx          # / — product intro
    CustomerMenu.tsx     # /menu/:tableId — mobile ordering + success screen
    KitchenDisplay.tsx   # /kitchen — real-time KDS board
    AdminPanel.tsx       # /admin — dashboard (Menu / QR / History tabs)
    AdminLogin.tsx       # login gate for the admin panel
  components/
    MenuCard.tsx         # customer menu item card
    CartDrawer.tsx       # bottom-sheet cart + special instructions
    OrderCard.tsx        # kitchen order ticket with status actions
    QRGenerator.tsx      # table QR grid + download/print
    MenuItemModal.tsx    # add/edit menu item form
    VegBadge.tsx         # veg/non-veg indicator
    Navbar.tsx           # shared brand navbar
  firebase/
    config.ts            # Firebase init + demo-mode detection
    orderService.ts      # place/subscribe/update orders
    menuService.ts       # CRUD for menu items
    authService.ts       # admin sign-in / sign-out
    demoStore.ts         # in-memory real-time store for demo mode
  hooks/
    useOrders.ts         # live orders subscription (+ new-order detection)
    useMenuItems.ts      # menu loading with loading/error state
    useAuth.ts           # admin auth state
  types/index.ts         # shared domain types
  data/menuData.ts       # hardcoded Café Spice demo menu
  utils/                 # currency/time formatting + ding sound
```

---

## 📸 Demo Screenshots Guide

To capture a compelling set of screenshots for restaurant owners:

1. **Landing** (`/`) — the hero "Smart Ordering. Zero Wait." with the three demo buttons.
2. **Customer Menu** (`/menu/table-5`) on a phone-width viewport — show a few items
   added and the floating cart bar at the bottom.
3. **Cart drawer** — open the cart, add a special instruction.
4. **Order success** — the "Order Placed! 🎉" confirmation with the order summary.
5. **Kitchen Display** (`/kitchen`) — a full board of colour-coded tickets
   (red = pending, gold = preparing, green = ready). Tip: keep it open for a
   minute so demo orders accumulate.
6. **Admin → QR Codes** — the generated grid; great for the "Print All" story.
7. **Admin → Order History** — the revenue summary cards + order table.

> Pro tip for live demos: open `/kitchen` on a laptop and `/menu/table-5` on a
> phone, then place a real order — the kitchen "dings" and the ticket appears
> instantly. That moment sells it.

---

## 📜 Scripts

```bash
npm run dev       # start dev server (http://localhost:5173)
npm run build     # type-check + production build
npm run preview   # preview the production build locally
```

---

Built for local restaurants in Hyderabad 🍛
