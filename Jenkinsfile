pipeline {
    agent any
    tools { nodejs "NodeJS" }
    stages {
        stage('Build nlp'){
            steps {
                sh '''
                    cd nlp/
                    npm install --omit=dev
                '''
            }
        }
        stage('Build server'){
            steps {
                sh '''
                    cd server/
                    npm install
                '''
            }
        }
    }
}