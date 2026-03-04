pipeline {
    agent any

    tools {
        // Must match names in Jenkins Global Tool Configuration
        nodejs 'Nodejs-20' 
        maven  'Maven 3.x' 
        jdk    'JDK 17'
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
                git branch: 'main', url: 'https://github.com/jaiswaraditya14/BXP.git'
            }
        }

        stage('Install & Build Full App') {
            parallel {
                stage('Backend Setup') {
                    steps {
                        dir('backend') {
                            echo '📦 Installing backend dependencies...'
                            bat 'npm install'
                        }
                    }
                }
                stage('Frontend Setup') {
                    steps {
                        dir('frontend') {
                            echo '📦 Installing frontend dependencies...'
                            bat 'npm install'
                            echo '� Building React frontend...'
                            bat 'npm run build'
                        }
                    }
                }
            }
        }

        stage('Start App & Run Selenium Tests') {
            steps {
                script {
                    echo '🚀 Starting Application and Running Tests...'
                    
                    // Start backend in background
                    dir('backend') {
                        bat 'start /B node server.js'
                    }
                    
                    // Wait for server to be ready
                    echo '⏳ Waiting for backend to start...'
                    bat 'timeout /t 15 /nobreak'
                    
                    // Run Java Selenium Tests
                    dir('java-selenium-project') {
                        echo '🧪 Executing 4 Selenium Test Cases...'
                        bat 'mvn clean test'
                    }
                }
            }
            post {
                always {
                    // Kill the node process after tests
                    bat 'taskkill /F /IM node.exe 2>nul || echo "Process already stopped"'
                }
            }
        }

        stage('Final Deployment') {
            steps {
                echo '� Deploying application...'
                dir('frontend') {
                    bat 'if exist build (echo "✅ Frontend build ready for distribution") else (echo "❌ ERROR: No build folder found")'
                }
            }
        }
    }

    post {
        always {
            dir('java-selenium-project') {
                echo '📊 Publishing Test Results...'
                testNG(reportFilenamePattern: '**/testng-results.xml')
                
                publishHTML([
                    allowMissing: false,
                    alwaysLinkToLastBuild: true,
                    keepAll: true,
                    reportDir: 'target/surefire-reports',
                    reportFiles: 'index.html',
                    reportName: 'TestNG HTML Report'
                ])
            }
        }
        success {
            echo '🎉 Full Pipeline completed successfully!'
        }
        failure {
            echo '❌ Pipeline failed. Check console logs and reports.'
        }
    }
}
