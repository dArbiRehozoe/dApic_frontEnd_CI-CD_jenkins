pipeline {
    agent any

    environment {
        GIT_CREDENTIALS = credentials('1')
        DOCKERHUB_CREDENTIALS = credentials('2')
    }

    stages {
        stage('gitclone') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'votre-credential-id', usernameVariable: 'GIT_USERNAME', passwordVariable: 'GIT_PASSWORD')]) {
                        // Utilisez la substitution de chaîne Groovy
                        def gitUrl = "https://${GIT_USERNAME}:${GIT_PASSWORD}@github.com/dArbiRehozoe/projetformation_client.git"
                        git url: gitUrl
                    }
                }
            }
        }

        stage('Login') {
            steps {
                sh 'echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'
            }
        }

        stage('Push') {
            steps {
                script {
                    // Utilisez le plugin Docker pour pousser l'image vers Docker Hub
                    docker.withRegistry('https://registry.hub.docker.com', 'dockerhub_credentials') {
                        docker.image('darbi/projetformation_client:latest').push()
                    }
                }
            }
        }

        stage('Deploy with Ansible') {
            steps {
                ansiblePlaybook playbook: 'deploy.yml'
            }
        }
    }
}
