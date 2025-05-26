# CRM Backend Setup

## Prerequisites
- Node.js (v18+ recommended)
- MongoDB (local or Atlas)

## Setup Instructions

1. Copy `.env.example` to `.env` and update the MongoDB connection string if needed:
   ```powershell
   Copy-Item .env.example .env
   ```
2. Install dependencies:
   ```powershell
   cd server
   npm install
   ```
3. Start the server:
   ```powershell
   npm run dev
   ```
   The server will run on the port specified in `.env` (default: 5000).

## API Endpoints

- `GET    /api/customers` — List all customers
- `GET    /api/customers/:id` — Get a single customer
- `POST   /api/customers` — Add a new customer
- `PUT    /api/customers/:id` — Edit a customer
- `DELETE /api/customers/:id` — Delete a customer
- `POST   /api/customers/:id/service-history` — Add service history
- `PUT    /api/customers/:id/service-history/:historyId` — Edit service history
- `DELETE /api/customers/:id/service-history/:historyId` — Delete service history

No authentication is required for now.
