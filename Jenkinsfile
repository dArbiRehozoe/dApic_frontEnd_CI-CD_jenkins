pipeline {
    agent any

    environment {
        GIT_CREDENTIALS = credentials('1')
        DOCKERHUB_CREDENTIALS = credentials('2')
    }

    stages {

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
                withDockerRegistry([credentialsId: '2', url: 'https://index.docker.io/v1/']) {}
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
