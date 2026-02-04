# Food Delivery – Order Management

A full-stack **Order Management** feature for a food delivery app: browse menu, add items to cart, checkout with delivery details, and track order status with real-time updates.

## Features

- **Menu** – List of food items with name, description, price, and image
- **Cart** – Add items, set quantity, remove items
- **Checkout** – Delivery details (name, address, phone) and place order
- **Order status** – Status flow: Order Received → Preparing → Out for Delivery → Delivered, with **real-time updates** (SSE)
- **REST API** – Menu, place order, get order, update status; in-memory store
- **TDD** – API tests (Jest) and UI component tests (Vitest + React Testing Library)

## Tech Stack

- **Frontend:** React 18, Vite, React Router
- **Backend:** Node.js, Express, in-memory store, Server-Sent Events for real-time status
- **Tests:** Jest + Supertest (API), Vitest + React Testing Library (UI)

## Quick Start

### Prerequisites

- Node.js 18+

### 1. Backend

```bash
cd backend
npm install
npm start
```

API runs at **http://localhost:3001**.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

App runs at **http://localhost:5173** and proxies `/api` to the backend.

### 3. Run tests

**Backend:**

```bash
cd backend
npm test
```

**Frontend:**

```bash
cd frontend
npm run test:run
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/menu` | List menu items |
| POST | `/api/orders` | Place order (body: `deliveryDetails`, `items`) |
| GET | `/api/orders` | List all orders |
| GET | `/api/orders/:id` | Get order by ID |
| PATCH | `/api/orders/:id/status` | Update order status (body: `status`) |
| GET | `/api/orders/:id/stream` | SSE stream for real-time order status |
| GET | `/api/order-statuses` | List valid status values |

### Place order body

```json
{
  "deliveryDetails": {
    "name": "Jane Doe",
    "address": "123 Main St, City",
    "phone": "555-123-4567"
  },
  "items": [
    { "menuItemId": "1", "quantity": 2 },
    { "menuItemId": "2", "quantity": 1 }
  ]
}
```

Validation: name/address/phone required and length limits; at least one item; quantity 1–99; `menuItemId` must exist in menu.

## Project structure

```
task/
├── backend/
│   ├── src/
│   │   ├── data/       # In-memory store, types
│   │   ├── middleware/ # Validation
│   │   ├── routes/     # menu, orders
│   │   ├── services/   # Status simulator
│   │   └── server.js
│   └── __tests__/      # API tests
├── frontend/
│   ├── src/
│   │   ├── api/        # API client
│   │   ├── context/    # Cart context
│   │   ├── pages/      # Menu, Cart, Checkout, OrderStatus
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── __tests__/      # Component tests
└── README.md
```

## Real-time order status

After an order is placed, the backend **simulates** status progression (Order Received → Preparing → Out for Delivery → Delivered) on timers. The frontend subscribes to **Server-Sent Events** at `GET /api/orders/:id/stream` and updates the order status page in real time.

## Hosting

- **Frontend:** Build with `cd frontend && npm run build`, then deploy the `dist/` folder to Vercel, Netlify, or similar. Set the API base URL via environment variable if the API is on another origin.
- **Backend:** Run on Railway, Render, Fly.io, etc., and set `PORT` as required. For production, replace the in-memory store with a database.

## License

MIT
