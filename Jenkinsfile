#!groovy

@Library(["gcp-workflowlib@master"]) _

buildAgent = "gcp-agent-${new Date().getTime()}"
deployAgent = "jenkinsagentseu-global-live"

pipeline {
    agent {
        kubernetes {
            label buildAgent
            defaultContainer 'gcloud-sdk'
            yaml """
apiVersion: v1
kind: Pod
metadata:
  labels:
    name: ${buildAgent}
spec:
  securityContext:
    runAsUser: 1000
  containers:
    - name: gcloud-sdk
      image: google/cloud-sdk:latest
      command:
        - cat
      tty: true
      resources:
        requests:
          cpu: 1
          memory: 512Mi
        limits:
          cpu: 1
          memory: 512Mi
    - name: sonar
      image: sonarsource/sonar-scanner-cli:4.3
      command:
        - cat
      tty: true
      resources:
        requests:
          cpu: 1
          memory: 2048Mi
        limits:
          cpu: 1
          memory: 2048Mi
    - name: node
      image: node:18
      command:
        - cat
      tty: true
      resources:
        requests:
          cpu: 1
          memory: 2048Mi
        limits:
          cpu: 1
          memory: 2048Mi
  imagePullSecrets:
    - name: registrypullsecret
"""
        }
    }

     options {
        ansiColor('xterm')
        timeout(time: 60, unit: 'MINUTES')
    }

    environment {
        UUAA = 'KPEG'
        SAMUEL_PROJECT_NAME = 'bbva-techbeat'
        CLI_MODE = 'jenkins'
        NO_PROXY = "172.20.0.0/16,10.60.0.0/16,169.254.169.254,.igrupobbva,.jenkins,.internal,localhost,127.0.0.1,127.20.0.1,central-jenkins-cache.s3.eu-west-1.amazonaws.com,central-jenkins-cache.s3.amazonaws.com,.eu-west-1.amazonaws.com,jenkins.globaldevtools.bbva.com,globaldevtools.bbva.com"
        HTTPS_PROXY = "http://proxy.cloud.local:8080"
        HTTP_PROXY = "http://proxy.cloud.local:8080"
        https_proxy = "http://proxy.cloud.local:8080"
        http_proxy = "http://proxy.cloud.local:8080"
        no_proxy = "172.20.0.0/16,10.60.0.0/16,169.254.169.254,.igrupobbva,.jenkins,.internal,localhost,127.0.0.1,127.20.0.1,central-jenkins-cache.s3.eu-west-1.amazonaws.com,central-jenkins-cache.s3.amazonaws.com,.eu-west-1.amazonaws.com,jenkins.globaldevtools.bbva.com,globaldevtools.bbva.com"
    }

    stages {
        stage ('Samuel setup') {
            steps {
                script {
                    gcpsamuel.prepare()
                }
            }
        }

        stage ('Setup .npmrc') {
            steps {
                container(name: 'node', shell: '/bin/sh') {
                    withCredentials([file(credentialsId: 'npm_vdc_credentials', variable: 'NPMCONF_PATH')]) {
                       sh 'cp ${NPMCONF_PATH} ${HOME}/.npmrc'
                    }
                }
            }
        }
        stage ('Install front dependencies') {
             steps {
                 container(name: 'node', shell: '/bin/sh') {
                    sh 'make install-front build_env=ci'
                 }
             }
        }

        stage ('Build front') {
            steps {
                container(name: 'node', shell: '/bin/sh') {
                    sh 'make build-front build_env=ci'
                }
            }
        }

        stage ('Front Test & coverage') {
            steps {
                container(name: 'node', shell: '/bin/sh') {
                    sh 'make test-front build_env=ci'
                }
            }
        }

        stage ('Static code analysis') {
            steps {
                container(name: 'sonar', shell: '/bin/sh') {
                    library 'sonar@lts'
                    script {
                        def statusCode = null
                        sonar([
                            waitForQualityGate: true
                        ]) {
                            statusCode = sh returnStatus: true, script: "sonar-scanner"
                        }
                        if (statusCode != 0) {
                            error 'Error executing sonar analysis'
                        }
                    }
                }
            }
        }

        stage ('Wait for Cloud Build') {
            steps {
                script {
                    try {
                        gcphelper.waitForCloudBuildExecution(true)

                    } catch (Exception e) {
                        currentBuild.result = 'FAILURE'
                        error "Error: ${e.getMessage()}"
                    }
                }
            }
        }
        
        stage ('Tag Version') {
            when { branch 'master' }
            steps {
                script {
                    def tag_version = null
                    tag_version = sh (
                      script: 'make get-tag-version',
                      returnStdout: true
                    ).trim()
                    short_hash = sh (
                      script: 'echo ${GIT_COMMIT} | head -c 7',
                      returnStdout: true
                    ).trim()
                    final_tag_version = "${tag_version}-${short_hash}"
                    gcphelper.createTag(final_tag_version, "Tagged by Jenkins")
                }
            }
        }
    }

    post {
        always {
            echo "We have been through the entire pipeline"
        }
        changed {
            echo "There have been some changes from the last build"
        }
        success {
            echo "Build successful"
        }
        failure {
            echo "There have been some errors"
        }
        unstable {
            echo "Unstable"
        }
        aborted {
            echo "Aborted"
            script {
                gcphelper.delete_notifications(true)
            }
        }
    }
}