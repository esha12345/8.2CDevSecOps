pipeline {
    agent any
    
    environment {
    PATH = "C:\\Users\\HP\\AppData\\Local\\Programs\\DockerDesktop\\resources\\bin;${env.PATH}"
 }
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
        echo 'Running automated unit tests with code coverage...'
        bat 'npx jest tests/utils.test.js --coverage'

        echo 'Starting environment for live application test...'
        bat 'docker-compose up -d --build'
        bat 'powershell -Command "Start-Sleep -Seconds 15"'
        bat 'curl -f http://localhost:3001/'
        echo 'Application responded successfully — test passed.'
    }
    post {
        always {
            bat 'docker-compose down'
        }
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
        echo 'Running dependency security audit...'

        script {
    def auditStatus = bat(
        returnStatus: true,
        script: 'npm audit --json > npm-audit.json'
    )

    archiveArtifacts artifacts: 'npm-audit.json',
                     allowEmptyArchive: false

    echo "npm audit completed with exit code: ${auditStatus}"

    if (auditStatus != 0) {
        echo 'npm audit reported vulnerabilities. The JSON report has been archived for review.'
    }
}
    }
}

       stage('Deploy') {
    steps {
        echo 'Deploying application to the test environment...'
        bat 'docker-compose down'
        bat 'docker-compose up -d --build'

        echo 'Checking deployed containers...'
        bat 'docker-compose ps'
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
        echo 'Monitoring deployed application...'

        bat 'docker-compose ps'
        bat 'curl -f http://localhost:3001/'

        echo 'Application health check completed successfully.'
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
