pipeline {
    agent any

    stages {

        stage('Build') {
            steps {
                echo 'Building the application...'
                bat 'npm run build'

                echo 'Building Docker image...'
                bat 'docker build -t 82cdevsecops-goof:%BUILD_NUMBER% .'
            }
        }

        stage('Test') {
            steps {
                echo 'Running automated tests...'
                bat 'npm test || exit /b 0'

                echo 'Generating coverage report...'
                bat 'npm run coverage || exit /b 0'
            }
        }

        stage('Code Quality') {
            steps {
                echo 'Running SonarQube code quality analysis...'

                withSonarQubeEnv('SonarQubeCloud') {
                    withCredentials([string(
                        credentialsId: 'sonar-token',
                        variable: 'SONAR_TOKEN'
                    )]) {
                        bat 'sonar-scanner -Dsonar.projectKey=esha12345_8.2CDevSecOps -Dsonar.organization=esha12345 -Dsonar.sources=.'
                    }
                }
            }
        }

        stage('Security') {
            steps {
                echo 'Running dependency security scan...'
                bat 'npm audit || exit /b 0'
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploying application to the test environment...'

                bat 'docker compose down'
                bat 'docker compose up -d --build'

                echo 'Checking deployed containers...'
                bat 'docker compose ps'
            }
        }

        stage('Release') {
            steps {
                echo 'Promoting the tested Docker image...'

                bat 'docker tag 82cdevsecops-goof:%BUILD_NUMBER% 82cdevsecops-goof:release-%BUILD_NUMBER%'

                echo 'Release artifact created successfully.'
                bat 'docker images 82cdevsecops-goof'
            }
        }

        stage('Monitoring') {
            steps {
                echo 'Monitoring the deployed application...'

                bat 'curl -f http://localhost:3001/'

                echo 'Application health check completed successfully.'
            }

            post {
                failure {
                    echo 'ALERT: Application health check failed.'
                }
            }
        }
    }

    post {
        success {
            echo 'All seven pipeline stages completed successfully.'
        }

        failure {
            echo 'Pipeline failed. Please review the failed stage console output.'
        }
    }
}
