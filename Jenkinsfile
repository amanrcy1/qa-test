pipeline {
    // run all stages inside our custom Docker image
    agent {
        docker {
            image 'qa-test-runner:latest'
            args '-v /tmp:/tmp'
        }
    }

    // auto-trigger on GitHub push
    triggers {
        githubPush()
    }

    // user picks environment and browser when triggering build manually
    parameters {
        choice(name: 'ENVIRONMENT', choices: ['staging', 'production'], description: 'Target environment')
        choice(name: 'BROWSER', choices: ['chrome', 'firefox', 'edge'], description: 'Browser for E2E tests')
    }

    environment {
        BASE_URL = 'https://www.saucedemo.com'
        DBUS_SESSION_BUS_ADDRESS = '/dev/null'
        CYPRESS_VERIFY_TIMEOUT = '120000'
    }

    options {
        timeout(time: 30, unit: 'MINUTES')  // kill build if stuck
        buildDiscarder(logRotator(numToKeepStr: '10')) // keep last 10 builds
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm // pull code from Git
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci' // clean install from lock file
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
                    npx cypress run \
                        --browser chromium \
                        --config baseUrl=${BASE_URL}
                """
            }
            post {
                always {
                    // save screenshots/videos for debugging failed tests
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
            deleteDir() // remove workspace files after build
        }
    }
}
