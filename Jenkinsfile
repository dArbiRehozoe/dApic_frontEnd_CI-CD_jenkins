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
                    sh 'docker build darbi/projetformation_client:v1'
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
                    sh 'docker push darbi/projetformation_client:v1'
                    }
                }
        }

        stage('chemain') {
            steps {
                script {
                    sh 'pwd'
                }
            }
        }
        stage('Deploy with Ansible') {
            steps {
                script {
                    sh 'sudo -u rehozoedarbi_gmail_com ansible-playbook -i inventory.ini playbook.yml'
                }
            }
        }
    }
}