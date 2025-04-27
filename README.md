# Healthcare Appointment System

A modern web application for managing healthcare appointments, built with Next.js, TypeScript, and MongoDB.

## Features

- Patient appointment booking
- Doctor management
- Appointment scheduling
- Real-time updates
- User authentication
- Responsive design

## Tech Stack

- **Frontend**: Next.js, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, MongoDB
- **Authentication**: Firebase Authentication
- **Database**: MongoDB
- **Styling**: Tailwind CSS, Shadcn UI

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- MongoDB
- Firebase account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/healthcare-appointment-system.git
cd healthcare-appointment-system
```

2. Install dependencies:
```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

3. Set up environment variables:
Create a `.env` file in the frontend directory:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
```

Create a `.env` file in the backend directory:
```env
MONGODB_URI=your_mongodb_uri
PORT=5000
```

4. Start the development servers:
```bash
# Start frontend
cd frontend
npm run dev

# Start backend (in a new terminal)
cd backend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Deployment

### Prerequisites for Deployment
- A GitHub account
- A Vercel account (for frontend)
- A MongoDB Atlas account (for database)
- A Firebase account (for authentication)

### Step 1: Prepare Your Repository
1. Make sure all your code is committed and pushed to GitHub
2. Ensure your `.gitignore` file is properly configured
3. Verify that all environment variables are properly documented

### Step 2: Set Up GitHub Secrets
1. Go to your GitHub repository
2. Navigate to Settings > Secrets and variables > Actions
3. Add the following secrets:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
   - `MONGODB_URI`
   - `PORT`

### Step 3: Deploy Frontend (Vercel)
1. Go to [Vercel](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure the following settings:
   - Framework Preset: Next.js
   - Root Directory: frontend
   - Build Command: `npm run build`
   - Output Directory: .next
5. Add all environment variables from your `.env` file
6. Click "Deploy"

### Step 4: Deploy Backend
1. Choose your preferred hosting service (e.g., Heroku, DigitalOcean, Railway)
2. Connect your GitHub repository
3. Configure the following:
   - Build Command: `npm run build`
   - Start Command: `npm start`
4. Add all environment variables from your backend `.env` file
5. Deploy the application

### Step 5: Configure CORS
1. Update your backend CORS settings to allow requests from your frontend domain
2. Update your frontend API calls to point to your deployed backend URL

### Step 6: Verify Deployment
1. Test all major functionality:
   - User authentication
   - Appointment booking
   - Doctor management
   - Real-time updates
2. Check for any console errors
3. Verify that all environment variables are working correctly

### Step 7: Set Up Continuous Deployment
1. The GitHub Actions workflow (`.github/workflows/deploy.yml`) is already configured
2. It will automatically run on every push to the main branch
3. Monitor the Actions tab in your GitHub repository for deployment status

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

Your Name - [@yourtwitter](https://twitter.com/yourtwitter)

Project Link: [https://github.com/yourusername/healthcare-appointment-system](https://github.com/yourusername/healthcare-appointment-system) # help
# help
# help
# abcd
