# JatraShongi - Bus Route Assistance for Dhaka

**JatraShongi** is a web-based application designed to help commuters in Dhaka city find bus routes, check fares, and get traffic updates.

## Features

- **Route Search**: Find bus routes between any two locations in Dhaka.
- **Fare Calculator**: Check official government-approved fares to avoid overcharging.
- **Traffic Updates**: View real-time traffic conditions.
- **Bus Ratings**: Rate and review bus services.
- **Emergency Assistance**: Quick access to emergency contacts (999).
- **Bilingual Support**: (Planned) Support for both Bangla and English.

## Tech Stack

- **Frontend**: React (Vite)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Routing**: React Router DOM

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation

1. Clone the repository (if applicable) or navigate to the project directory.
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the App

Start the development server:
```bash
npm run dev
```
The app will be available at `http://localhost:5173`.

### Building for Production

Build the app for deployment:
```bash
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── auth/       # Authentication components (Login)
│   ├── emergency/  # Emergency features
│   ├── fare/       # Fare calculation components
│   ├── layout/     # Layout components (Navbar, Footer)
│   ├── rating/     # Rating components
│   ├── route/      # Route search components
│   ├── traffic/    # Traffic status components
│   └── ui/         # Reusable UI components
├── pages/          # Page components (Home, Login, Routes, etc.)
├── assets/         # Static assets (images, icons)
└── App.tsx         # Main application component with routing
```

## Contributing

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/amazing-feature`).
3. Commit your changes (`git commit -m 'Add some amazing feature'`).
4. Push to the branch (`git push origin feature/amazing-feature`).
5. Open a Pull Request.

## License

This project is licensed under the MIT License.
