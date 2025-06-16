# PROTO Twice - AI-Powered Prototype Generator

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

A Progressive Web App that generates interactive UI prototypes using AI.

![PROTO Twice Screenshot](https://via.placeholder.com/800x400?text=PROTO+Twice+Screenshot)

## Features

- 🚀 AI-powered prototype generation (OpenAI GPT-4)
- 📱 Responsive design with device previews
- 💾 Save projects to Supabase database
- ⚡ Installable PWA with offline support
- 🎨 Multiple fidelity levels (Wireframe to High-Fidelity)

## Tech Stack

- **Frontend**: Next.js, TypeScript, Tailwind CSS
- **Backend**: Express.js, TypeScript
- **Database**: Supabase (PostgreSQL)
- **AI**: OpenAI API

## Getting Started

### Prerequisites
- Node.js v18+
- Supabase account
- OpenAI API key

### Installation
```bash
# Clone the repository
git clone https://github.com/your-username/proto-twice.git
cd proto-twice

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install

# Copy environment templates
cp .env.example .env
cd ../frontend
cp .env.example .env.local
```

### Running Locally
```bash
# Start backend
cd backend
npm run dev

# Start frontend (in separate terminal)
cd ../frontend
npm run dev
```

- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Deployment

### Frontend (Vercel)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyour-username%2Fproto-twice&env=NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY&envDescription=Supabase%20credentials%20for%20database%20access)

### Backend (Railway)
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template?template=node&envs=PORT,SUPABASE_URL,SUPABASE_SERVICE_KEY,OPENAI_API_KEY)

## Project Structure
```
proto-twice/
├── frontend/          # Next.js PWA application
│   ├── src/           # Source code
│   ├── public/        # Static assets
│   ├── next.config.mjs # Next.js configuration
│   └── package.json
├── backend/           # Express.js server
│   ├── src/           # Source code
│   ├── tsconfig.json  # TypeScript config
│   └── package.json
├── .gitignore         # Git ignore rules
└── README.md          # Project documentation
```

## Contributing
Pull requests are welcome! For major changes, please open an issue first.

## License
Distributed under the MIT License. See `LICENSE` for more information.

## Ollama Setup for Offline Mode

To enable offline prototype generation:

1. **Install Ollama**:
   ```bash
   # Linux/macOS
   curl -fsSL https://ollama.com/install.sh | sh

   # Windows (requires WSL2)
   winget install ollama.ollama
