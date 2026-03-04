pipeline {
    agent any

    tools {
        // These names must match what you configured in Jenkins 'Global Tool Configuration'
        maven 'Maven 3.x' 
        jdk   'JDK 17'
    }

    stages {
        stage('Checkout') {
            steps {
                // Change to your actual repository URL
                git branch: 'main', url: 'https://github.com/jaiswaraditya14/BXP.git'
            }
        }

        stage('Build & Test') {
            steps {
                dir('java-selenium-project') {
                    echo '🚀 Running Selenium Tests...'
                    // 'bat' for Windows Jenkins, 'sh' for Linux
                    bat 'mvn clean test' 
                }
            }
        }
    }

    post {
        always {
            dir('java-selenium-project') {
                echo '📊 Publishing Test Results...'
                // Requires 'TestNG Results' plugin
                testng(results: '**/testng-results.xml')
                
                // Requires 'HTML Publisher' plugin
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
            echo '🎉 Tests passed successfully!'
        }
        failure {
            echo '❌ Tests failed. Please check the reports.'
        }
    }
}
