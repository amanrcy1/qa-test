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
    }

    environment {
        BASE_URL                 = 'https://www.saucedemo.com'
        DBUS_SESSION_BUS_ADDRESS = '/dev/null'
        CYPRESS_CACHE_FOLDER     = '/opt/cypress_cache'
        CYPRESS_VERIFY_TIMEOUT   = '120000'
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
                    export CYPRESS_CACHE_FOLDER=/opt/cypress_cache
                    export DBUS_SESSION_BUS_ADDRESS=/dev/null
                    export ELECTRON_EXTRA_LAUNCH_ARGS='--no-sandbox --disable-gpu --disable-dev-shm-usage'
                    xvfb-run --auto-servernum --server-args='-screen 0 1280x720x24' \
                    node_modules/.bin/cypress run \
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
