pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('2')
    }

    stages {
        stage('gitclone') {
            steps {
                git 'https://github.com/dArbiRehozoe/projetformation_client.git'
            }
        }

        stage('Build') {
            steps {
                script {
                    // Utilisez le plugin Docker pour construire l'image
                    docker.build('darbi/projetformation_client:latest')
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
