

# Luxora Boutique
![alt text](image.png)


**Luxora** is a premium online boutique storefront built with the MERN stack and TypeScript, designed to merge aesthetics, performance, and security. The platform features a luxury UI experience with ultra-responsive design, smooth animations, and intelligent business logic, optimized for modern devices and global users.

## Table of Contents

- [Project Overview](#project-overview)
- [Monorepo Structure](#monorepo-structure)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Environment Variables](#environment-variables)
- [Folder Structure Details](#folder-structure-details)
- [UI/UX Design](#uiux-design)
- [Backend API Endpoints](#backend-api-endpoints)
- [Shared Packages](#shared-packages)
- [Testing](#testing)
- [Deployment](#deployment)
- [Security Considerations](#security-considerations)
- [Contributing](#contributing)
- [License](#license)


## Project Overview

Luxora is crafted to offer a refined luxury shopping experience with features including:

- Premium typography and color palette
- Responsive, accessible UI with Tailwind CSS
- Micro-interactions and smooth page/product animations powered by Framer Motion
- Multi-step checkout with validation
- Secure authentication with JWT and cookie-based sessions
- Robust backend with Node.js, Express, MongoDB, and Mongoose
- Image uploads integrated with Cloudinary
- Rate limiting, CORS, and Helmet for security
- Shared reusable UI components, hooks, types, and utilities in a modular monorepo setup


## Monorepo Structure

```
luxora-ecommerce/
│
├── apps/
│   ├── client/            # React + TypeScript frontend (Vite + Tailwind)
│   └── server/            # Node.js + Express + MongoDB backend API
│
├── packages/
│   ├── ui/                # Shared Tailwind-based component library (Framer Motion)
│   ├── hooks/             # Shared React hooks (useCart, useAuth, etc.)
│   ├── types/             # Global TypeScript interfaces/models
│   └── utils/             # Utility functions (API clients, formatters, payment handlers)
│
├── .env                   # Environment variables for monorepo
├── package.json           # Workspace configuration & scripts
└── turbo.json / nx.json   # Monorepo task orchestration config (Turborepo or Nx)
```


## Tech Stack

| Layer | Technology |
| :-- | :-- |
| Frontend | React, TypeScript, Vite, Tailwind CSS, Framer Motion |
| Backend | Node.js, Express.js, TypeScript, MongoDB, Mongoose, Cloudinary |
| Authentication | JWT, bcrypt |
| Utilities | Yup, React Hook Form (validation), Axios (API calls) |
| Security | CORS, express-rate-limit |

## Features

### Client

- Responsive luxury storefront UI with premium fonts (Playfair Display, Inter)
- Product catalog browsing with filters and search
- Shopping cart with quantity adjustments and live animations
- Multi-step checkout form with validation
- Admin protected routes for product \& order management
- Smooth page and component transitions via Framer Motion


### Server

- RESTful API with versioned routes for products, orders, admin auth, and image uploads
- Secure admin login and JWT-protected endpoints
- MongoDB with Mongoose ODM schema validation
- Image upload API integrated with Cloudinary
- Middleware for validation, rate-limiting, CORS, and headers hardening


## Getting Started

### Prerequisites

- Node.js >= 18.x
- MongoDB instance (local or MongoDB Atlas)
- Cloudinary account for image uploads
- Yarn or PNPM package manager recommended


### Install Dependencies

From the root directory:

```sh
yarn install
# or
pnpm install
```


### Setup Environment Variables

Create a `.env` file in the project root following `.env.example`:

```
PORT=4000
CLIENT_URL=http://localhost:5173
DB_URI=mongodb+srv://yourMongoURI
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```


### Running Development Servers

- Start backend server:

```sh
yarn dev --filter=server
```

- Start frontend app:

```sh
yarn dev --filter=client
```

Frontend will be accessible at [http://localhost:5173](http://localhost:5173)

Backend API will run on the port specified in `.env` (default 4000)

## Development Workflow

- Shared React components \& Tailwind styles are developed inside `/packages/ui` and consumed by frontend
- Custom hooks live in `/packages/hooks` (examples: `useCart`, `useAuth`)
- API types/interfaces defined in `/packages/types` ensure type safety across client and server
- Utility functions like API clients and formatters reside in `/packages/utils`
- Express routes/controllers/models follow a modular pattern inside `/apps/server`


## Folder Structure Details

### `apps/client`

- `src/components` — reusable UI components
- `src/pages` — route components mapped with React Router
- `src/hooks` — client-specific hooks (not shared)
- `src/assets` — images, fonts, and static files
- `src/styles` — Tailwind entry and custom styles


### `apps/server`

- `src/routes` — Express route definitions (products, orders, auth, admin, uploads)
- `src/controllers` — request handlers
- `src/models` — Mongoose schemas
- `src/middleware` — authentication, validation, error handlers
- `src/utils` — helper functions (token generation, logging)


### `packages/ui`

- Tailwind CSS config and component library
- Framer Motion for animation utilities integrated into components


## UI/UX Design

Inspired by premium templates (UI8, Dribbble):

- Fonts: Playfair Display (serif), Inter or Satoshi (sans-serif)
- Palette: Deep matte black (\#0b0b0b), champagne gold (\#f7e7ce), rich burgundy (\#6e0f25), ivory white (\#fffff0)
- Effects: Glassmorphism on navbar/cart overlays, subtle gradients, shimmering loaders
- Animations for page transitions, product hover reveals, and cart slide-in effects


## Backend API Endpoints

| Method | Route | Description | Auth Required |
| :-- | :-- | :-- | :-- |
| GET | /api/products | Fetch all products | No |
| POST | /api/orders | Create a new order | No |
| POST | /api/auth/login | Admin login, returns JWT | No |
| PATCH | /api/admin/product/:id | Update a product | Yes |
| POST | /api/upload | Upload product image | Yes |

## Shared Packages

### `/packages/ui`

- Collection of reusable Tailwind-styled React components with Framer Motion animations


### `/packages/hooks`

- Custom hooks to abstract common client state and logic (cart, authentication status, responsive breakpoints)


### `/packages/types`

- Centralized TypeScript interfaces \& types shared between client and server


### `/packages/utils`

- Utility functions like API wrappers, payment handlers, className merging utils, and formatting helpers


## Testing

- **Frontend:** Jest + React Testing Library for unit and integration tests
- **Backend:** Jest or Mocha for route and controller tests
- Postman or Insomnia collections available for API testing


## Deployment

- Frontend can be deployed to platforms like Vercel or Netlify
- Backend hosted on Heroku, Railway, or any Node.js compatible platform
- MongoDB Atlas for cloud DB hosting
- Environment variables configured on respective platforms


## Security Considerations

- JWT with secure, HttpOnly cookies for authentication
- Password hashing with bcrypt
- Rate limiting and CORS policies on API
- Helmet middleware securing HTTP headers
- Environment variables for sensitive keys (never commit `.env`)


## Contributing

Contributions are welcome! Please fork the repository, make your changes, and submit a pull request. Ensure all tests pass and code formatting complies with project linting rules.