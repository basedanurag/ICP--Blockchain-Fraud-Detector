# ICP Blockchain Fraud Detection System - Full Stack Implementation

A comprehensive blockchain fraud detection system that combines AI/ML fraud detection capabilities with a robust full-stack application. This project provides real-time analysis of blockchain transactions to identify potentially fraudulent activities on the ICP blockchain.

## 🏗️ Project Architecture

The system consists of three main components:

- **AI/ML Service**: Python-based fraud detection module using RandomForestClassifier
- **Backend API**: Rust-based backend service providing RESTful APIs
- **Frontend Dashboard**: React-based web application for user interaction
- **Database**: MongoDB for data persistence

## 📋 Prerequisites

Before setting up the project, ensure you have the following installed:

### Required Software
- **Docker** (for MongoDB)
- **Python 3.8+** (for AI/ML service)
- **Rust 1.70+** (for backend service)
- **Node.js 16+** and **npm** (for frontend)
- **Git** (for version control)

### Development Tools (Recommended)
- **MongoDB Compass** (for database management)
- **Postman** or **Thunder Client** (for API testing)
- **VS Code** or your preferred IDE

## 🚀 Installation & Setup

### 1. Clone and Navigate to Project
```bash
git clone https://github.com/basedanurag/ICP--Blockchain-Fraud-Detector.git
cd "ICP--Blockchain-Fraud-Detector"
```

### 2. Start MongoDB Database
```bash
# Start MongoDB using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Verify MongoDB is running
docker ps
```

### 3. Setup AI/ML Fraud Detection Service
```bash
# Navigate to fraud detection module
cd fraud_detection_module

# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Train the fraud detection model (if not already present)
python train_model.py

# Test the fraud detection module
python test_fraud_detection.py

# Return to project root
cd ..
```

### 4. Setup Rust Backend Service
```bash
# Navigate to backend directory
cd backend

# Build the Rust project
cargo build

# Run the backend service
cargo run
# Backend will be available at http://localhost:8080

# In a new terminal, return to project root
cd ..
```

### 5. Setup React Frontend
```bash
# Navigate to frontend directory
cd frontend

# Install Node.js dependencies
npm install

# Start the development server
npm start
# Frontend will be available at http://localhost:3000
```

## 🔗 Service URLs

Once all services are running, you can access:

- **Frontend Dashboard**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **MongoDB**: mongodb://localhost:27017
- **AI/ML Service**: Integrated with backend

## 🧪 Testing the System

### Backend API Testing
```bash
# Test backend health endpoint
curl http://localhost:8080/health

# Test fraud analysis endpoint
curl -X POST http://localhost:8080/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"wallet_address": "0x1234567890abcdef1234567890abcdef12345678"}'
```

### Frontend Testing
1. Open http://localhost:3000 in your browser
2. Navigate through the dashboard
3. Test fraud detection functionality
4. Verify data visualization components

## 📁 Project Structure

```
ICP--Blockchain-Fraud-Detector/
├── backend/                    # Rust backend service
│   ├── src/
│   │   ├── main.rs            # Application entry point
│   │   ├── routes.rs          # API route definitions
│   │   ├── models.rs          # Data models
│   │   ├── db.rs              # Database operations
│   │   └── icp/               # ICP blockchain integration
│   ├── Cargo.toml             # Rust dependencies
│   └── .env                   # Environment variables
├── frontend/                   # React frontend application
│   ├── src/
│   ├── public/
│   ├── package.json           # Node.js dependencies
│   └── tailwind.config.js     # Tailwind CSS configuration
├── fraud_detection_module/     # Python AI/ML service
│   ├── fraud_detection.py     # Main fraud detection logic
│   ├── train_model.py         # Model training script
│   ├── test_fraud_detection.py # Testing script
│   ├── fraud_model.pkl        # Trained ML model
│   └── requirements.txt       # Python dependencies
├── README.md                   # This file
└── BACKEND_DEVELOPER_GUIDE.md  # Backend development guide
```

## 🔧 Development Commands

### Backend Development
```bash
cd backend
cargo check          # Check for compilation errors
cargo test           # Run tests
cargo run --release  # Run optimized build
```

### Frontend Development
```bash
cd frontend
npm run build        # Build for production
npm test             # Run tests
npm run eject        # Eject from Create React App (irreversible)
```

### AI/ML Model Development
```bash
cd fraud_detection_module
python train_model.py              # Retrain the model
python test_fraud_detection.py     # Test model performance
```

## 🛠️ Configuration

### Environment Variables

Create a `.env` file in the `backend` directory:
```env
DATABASE_URL=mongodb://localhost:27017/fraud_detection
RUST_LOG=info
SERVER_HOST=127.0.0.1
SERVER_PORT=8080
```

### MongoDB Configuration
The system uses MongoDB for data persistence. Ensure MongoDB is running on the default port (27017) or update the connection string in your configuration.

## 📊 Features

- **Real-time Fraud Detection**: AI-powered analysis of blockchain transactions
- **Interactive Dashboard**: React-based web interface for monitoring and analysis
- **REST API**: Comprehensive API for integration with external systems
- **Scalable Architecture**: Microservices-based design for easy scaling
- **Data Visualization**: Charts and graphs for fraud pattern analysis
- **Historical Analysis**: View historical fraud detection results

## 🚨 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure Docker is running: `docker ps`
   - Restart MongoDB container: `docker restart mongodb`

2. **Rust Compilation Errors**
   - Update Rust: `rustup update`
   - Clean build: `cargo clean && cargo build`

3. **Frontend Build Issues**
   - Clear npm cache: `npm cache clean --force`
   - Delete node_modules: `rm -rf node_modules && npm install`

4. **Python Module Import Errors**
   - Ensure virtual environment is activated
   - Reinstall dependencies: `pip install -r requirements.txt`

### Logs Location
- Backend logs: Console output when running `cargo run`
- Frontend logs: Browser console (F12)
- AI/ML logs: `fraud_detection_module/fraud_detection.log`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 🏆 Acknowledgments

- Built for DoraHacks hackathon
- Uses ICP blockchain infrastructure
- Implements machine learning for fraud detection
- Modern full-stack architecture with Rust and React

---

**Note**: This is a development setup guide. For production deployment, additional considerations for security, monitoring, and scalability should be implemented.
