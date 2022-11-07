pipeline {
    agent any
    tools { nodejs "NodeJS" }
    stages {
        stage('Pull successful') { 
            steps {
                echo 'Pull successful'
            }
        }
        stage('Build nlp'){
            steps {
                sh '''
                    cd nlp/
                    npm install --omit=dev
                '''
            }
        }
    }
}