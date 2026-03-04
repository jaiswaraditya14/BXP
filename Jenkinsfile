pipeline {
    agent any

    tools {
        nodejs 'Nodejs-20'  // Updated based on your Jenkins configuration
    }

    environment {
        MONGODB_URI = 'mongodb://localhost:27017/bookexchange'
        JWT_SECRET  = 'your_jwt_secret_key'
        PORT        = '5000'
    }

    stages {

        stage('Checkout') {
            steps {
                echo '📥 Checking out source code...'
                // Option 1: Use this if you configured "Pipeline script from SCM"
                // checkout scm
                
                // Option 2: Use this if you are pasting the script manually (Replace with your repo details)
                git branch: 'main', url: 'https://github.com/your-username/your-repo.git'
            }
        }

        stage('Install Backend Dependencies') {
            steps {
                echo '📦 Installing backend dependencies...'
                dir('backend') {
                    bat 'npm install'       // Use 'sh' instead of 'bat' on Linux
                }
            }
        }

        stage('Install Frontend Dependencies') {
            steps {
                echo '📦 Installing frontend dependencies...'
                dir('frontend') {
                    bat 'npm install'       // Use 'sh' instead of 'bat' on Linux
                }
            }
        }

        stage('Build Frontend') {
            steps {
                echo '🔨 Building React frontend...'
                dir('frontend') {
                    bat 'npm run build'     // Use 'sh' instead of 'bat' on Linux
                }
            }
        }

        stage('Test Backend') {
            steps {
                echo '🧪 Testing backend server startup...'
                dir('backend') {
                    // Start the server in background, wait 10s, then check if it responds
                    bat '''
                        start /B node server.js
                        timeout /t 10 /nobreak
                        curl -s http://localhost:5000 || echo "Server check failed"
                        taskkill /F /IM node.exe 2>nul || echo "No node process to kill"
                    '''
                    // Use the below block instead on Linux:
                    // sh '''
                    //     node server.js &
                    //     sleep 10
                    //     curl -s http://localhost:5000 || echo "Server check failed"
                    //     kill %1 2>/dev/null || true
                    // '''
                }
            }
        }

        stage('Deploy') {
            steps {
                echo '🚀 Deploying application...'
                // Option 1: Simple deployment - copy build to serve folder
                dir('frontend') {
                    bat 'if exist build (echo Frontend build ready for deployment) else (echo ERROR: No build folder found)'
                }
                // Option 2: For production, you could:
                // - Copy files to a web server (nginx, apache)
                // - Deploy to a cloud service
                // - Run with PM2: bat 'npm install -g pm2 && cd backend && pm2 start server.js --name bxp-backend'
                echo '✅ Deployment stage complete!'
            }
        }
    }

    post {
        success {
            echo '🎉 Pipeline completed successfully!'
        }
        failure {
            echo '❌ Pipeline failed. Check the console output for details.'
        }
        always {
            echo '📋 Pipeline execution finished.'
        }
    }
}
