pipeline {
   agent any
   tools {
      maven 'MAVEN_HOME'
      jdk 'JAVA_HOME'
   }
    stages {
        stage('run backend jenkins') {
            steps {
                 // Run Maven on a Unix agent.
                sh "cd backend"
                //stop image
                sh "docker stop 44128920/reddit-server-1 || true && docker rm 44128920/reddit-server-1 || true"
                // Remove image
                sh "docker rmi 44128920/reddit-server-1 || true"
                script {
                    dockerImage = docker.build("44128920/reddit-server-1:0.0.5")
                    docker.image("44128920/reddit-server-1").run('--name 44128920/reddit-server-1 -p 8088:8088 --restart unless-stopped ')
                }
                sleep(time:20,unit:"SECONDS")
                echo 'Build image backend success'
            }
        }


         stage('run socket jenkins') {
            steps {
                 // Run Maven on a Unix agent.
                sh "cd ../socket"
                //stop image
                sh "docker stop  44128920/reddit-socket || true && docker rm  44128920/reddit-socket || true"
                // Remove image
                sh "docker rmi  44128920/reddit-socket || true"
                script {
                    dockerImage = docker.build("44128920/reddit-socket:0.0.3")
                    docker.image("44128920/reddit-socket").run('--name 44128920/reddit-socket -p 8089:8089 --restart unless-stopped ')
                }
                sleep(time:20,unit:"SECONDS")
                echo 'Build image socket success'
            }
        }

        stage('run frontend jenkins') {
            steps {
                 // Run Maven on a Unix agent.
                sh "cd ../frontend"
                //stop image
                sh "docker stop  44128920/reddit-front-end || true && docker rm  44128920/reddit-front-end || true"
                // Remove image
                sh "docker rmi  44128920/reddit-front-end || true"
                script {
                    dockerImage = docker.build("44128920/reddit-front-end:0.0.4")
                    docker.image("44128920/reddit-front-end").run('--name 44128920/reddit-front-end -p 8089:8089 --restart unless-stopped ')
                }
                sleep(time:20,unit:"SECONDS")
                echo 'Build image webapp success'
            }
        }
    }
}
