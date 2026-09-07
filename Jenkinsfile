pipeline {
    agent any

    stages {
        stage('Check Node and npm') {
            steps {
                bat 'node --version'
                bat 'npm --version'
            }
        }
    }
}