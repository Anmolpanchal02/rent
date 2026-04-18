# Smart Rental Platform

A full-stack web application that connects property owners with potential tenants through a real-time rental marketplace.

## Tech Stack

- **Framework:** Next.js 14+ with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Animations:** Framer Motion
- **Database:** MongoDB with Mongoose
- **Real-time:** Socket.IO
- **Authentication:** JWT + bcrypt
- **Image Storage:** Cloudinary
- **Maps:** Google Maps API
- **Payments:** Razorpay
- **Email:** Nodemailer

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB instance (local or cloud)
- API keys for external services (optional for development)

### Installation

1. Install dependencies:

```bash
npm install
```

2. Set up environment variables:

Copy `.env.example` to `.env.local` and fill in your configuration:

```bash
cp .env.example .env.local
```

Required variables:
- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token generation

Optional (for full functionality):
- `CLOUDINARY_*`: Cloudinary credentials for image uploads
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`: Google Maps API key
- `RAZORPAY_*`: Razorpay credentials for payments
- `EMAIL_*`: Email service configuration

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

Build for production:

```bash
npm run build
npm start
```

## Project Structure

```
├── app/                    # Next.js App Router pages
├── components/             # React components
│   └── ui/                # shadcn/ui components
├── lib/                   # Utility functions and configurations
│   ├── db.ts             # Database connection
│   ├── cloudinary.ts     # Cloudinary configuration
│   ├── email.ts          # Email service
│   ├── razorpay.ts       # Payment gateway
│   └── utils.ts          # Helper functions
├── types/                 # TypeScript type definitions
├── middleware/            # Next.js middleware (auth, etc.)
└── .env.local            # Environment variables (not in git)
```

## Features

- Role-based authentication (Tenant, Owner, Admin)
- Property listing management
- Real-time chat communication
- Booking workflow with payment integration
- Responsive design with smooth animations
- Image optimization and lazy loading
- Google Maps integration for property locations

## License

MIT
