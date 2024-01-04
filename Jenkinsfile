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
                    withCredentials([usernamePassword(credentialsId: '1', usernameVariable: 'GIT_USERNAME', passwordVariable: 'GIT_PASSWORD')]) {
                        // Utilisez l'URL Git avec les variables d'environnement correctement référencées
                        git url: "https://${GIT_USERNAME}:${GIT_PASSWORD}@github.com/dArbiRehozoe/projetformation_client.git"
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
