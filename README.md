# Driply Store - E-commerce Website

Premium clothing store built with React, Node.js, and MongoDB.

## Features

- 🛍️ Product catalog with categories (Jackets, Pants, Hoodies, Crow-Nek)
- 🛒 Shopping cart with quick order
- 📦 Checkout with order management
- 👨‍💼 Admin dashboard for product and order management
- 📱 Fully responsive design
- 🎨 Clean and modern UI

## Tech Stack

**Frontend:**
- React 18
- React Router DOM
- Tailwind CSS
- Axios
- SweetAlert2
- React Icons

**Backend:**
- Node.js
- Express
- MongoDB with Mongoose
- CORS

## Installation

### 1. Install Dependencies

```bash
npm install
cd server && npm install && cd ..
```

### 2. Environment Variables

Create `.env` file in the root directory:

```env
MONGODB_URI=mongodb+srv://driply_admin:Driply123!@cluster0.fmsf8fl.mongodb.net/driply?retryWrites=true&w=majority&appName=Cluster0
ADMIN_TOKEN=driply_admin_secret_2024
```

### 3. Add Images

Place these images in the `public` folder:
- `logo.jpg` - Store logo (will be displayed as circular)
- `home.jpg` - Hero section background
- `jacket.jpg` - Jacket category image
- `pants.jpg` - Pants category image
- `hoodie.jpg` - Hoodies category image
- `crow.jpg` - Crow-Nek category image

## Running Locally

### Start Backend Server
```bash
npm run server
```

### Start Frontend (in another terminal)
```bash
npm start
```

The app will open at `http://localhost:3000`

## Admin Access

- **URL:** `/admin/login`
- **Email:** `admin@driply.com`
- **Password:** `admin123`

## Deploying to Vercel

### 1. Install Vercel CLI (optional)
```bash
npm i -g vercel
```

### 2. Deploy

**Option A: Using Vercel Dashboard**
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Add Environment Variables:
   - `MONGODB_URI`
   - `ADMIN_TOKEN`
6. Click "Deploy"

**Option B: Using Vercel CLI**
```bash
vercel
```

### 3. Configure Environment Variables

In Vercel Dashboard → Settings → Environment Variables, add:
- `MONGODB_URI` = Your MongoDB connection string
- `ADMIN_TOKEN` = Your admin token

### 4. Redeploy

After adding environment variables, redeploy:
```bash
vercel --prod
```

## Project Structure

```
driply/
├── public/              # Static files (images)
├── src/
│   ├── components/      # React components
│   │   ├── Navbar.js
│   │   ├── Footer.js
│   │   ├── ProductCard.js
│   │   ├── QuickOrder.js
│   │   └── Loading.js
│   ├── pages/          # Page components
│   │   ├── Home.js
│   │   ├── Products.js
│   │   ├── ProductDetails.js
│   │   ├── Category.js
│   │   ├── Cart.js
│   │   ├── Checkout.js
│   │   ├── Admin.js
│   │   └── AdminLogin.js
│   ├── App.js
│   ├── index.js
│   └── index.css
├── server/             # Backend server
│   ├── index.js
│   └── package.json
├── api/                # Vercel serverless functions
│   ├── lib/
│   │   ├── db.js
│   │   └── auth.js
│   ├── auth/
│   │   └── login.js
│   ├── products/
│   │   ├── index.js
│   │   ├── latest.js
│   │   ├── [id]/
│   │   │   ├── index.js
│   │   │   └── soldout.js
│   │   └── category/
│   │       └── [name].js
│   └── orders/
│       ├── index.js
│       └── [id]/
│           ├── index.js
│           └── status.js
├── vercel.json
└── package.json
```

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/latest` - Get latest product
- `GET /api/products/category/:name` - Get products by category
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `PATCH /api/products/:id/soldout` - Toggle sold out (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Orders
- `GET /api/orders` - Get all orders (Admin)
- `POST /api/orders` - Create order
- `PATCH /api/orders/:id/status` - Update order status (Admin)
- `DELETE /api/orders/:id` - Delete order (Admin)

### Auth
- `POST /api/auth/login` - Admin login

## Contact

- **TikTok:** [@driply_store.1](https://www.tiktok.com/@driply_store.1)
- **WhatsApp:** +20 110 287 1570

## License

Private - All rights reserved
