pipeline {
    agent {
        docker {
            image 'qa-test-runner:latest'
            args '-v /tmp:/tmp --shm-size=512m'
        }
    }

    triggers {
        githubPush()
    }

    parameters {
        choice(name: 'ENVIRONMENT', choices: ['staging', 'production'], description: 'Target environment')
    }

    environment {
        BASE_URL = 'https://www.saucedemo.com'
        ELECTRON_EXTRA_LAUNCH_ARGS = '--disable-dev-shm-usage --disable-gpu --no-sandbox'
    }

    options {
        timeout(time: 30, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Lint Tests') {
            steps {
                sh 'npm run lint'
            }
        }

        stage('API Tests') {
            steps {
                sh 'npm run test:api'
            }
        }

        stage('E2E Tests - Cypress') {
            steps {
                sh """
                    # Start dbus so Cypress Electron doesn't hang
                    dbus-daemon --system --fork || true
                    
                    xvfb-run --auto-servernum --server-args='-screen 0 1280x720x24' \
                    npx cypress run \
                        --config baseUrl=${BASE_URL}
                """
            }
            post {
                always {
                    archiveArtifacts artifacts: 'cypress/screenshots/**,cypress/videos/**', allowEmptyArchive: true
                }
            }
        }
    }

    post {
        success {
            echo '✅ All tests passed!'
        }
        failure {
            echo '❌ Some tests failed. Check the reports.'
        }
        always {
            deleteDir()
        }
    }
}
