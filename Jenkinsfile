pipeline {
    agent any
    tools { nodejs "NodeJS" }
    stages {
        stage('Pull successful') { 
            steps {
                sh 'ls -la' 
                sh 'node -v'
            }
        }
    }
}