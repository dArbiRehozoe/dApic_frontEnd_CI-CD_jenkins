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
                // Utilisez la substitution de chaîne Groovy pour construire l'URL Git
                def gitUrl = "https://${env.GIT_USERNAME}:${env.GIT_PASSWORD}@github.com/dArbiRehozoe/projetformation_client.git"
                git branch: 'main', credentialsId: '1', url: gitUrl
                    }
                }
            }
        }
        stage('Build') {
            steps {
                script {
                    // Utilisez le plugin Docker pour construire l'image
                    sh 'docker build -t darbi/projetformation_client:latest .'
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
                    docker.withRegistry('https://registry.hub.docker.com', '2') {
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
