WEBAPP_NODE_VERSION := 18

# Building the project

create-venv: ## Creates a venv if it does not already exists
	test -d venv || python3.11 -m venv venv
install-public: create-venv ## Install back app dependencies
	. venv/bin/activate && \
	python -m pip install -r requirements.txt
install-private: create-venv ## Install back app private dependencies in lib folder
ifndef pip_conf_location
	. venv/bin/activate && \
	pip install -r requirements-private.txt -t lib --upgrade
else
	export PIP_CONFIG_FILE=${pip_conf_location} && \
	. venv/bin/activate && \
	pip install -r requirements-private.txt -t lib --upgrade
endif
install-dev: create-venv ## Install back app dev dependencies
	. venv/bin/activate && \
	python -m pip install -r requirements-dev.txt	

install-front: ## Install front app dependencies
	make npm-webapp command=install

build-front: ## Build front app
	make npm-run-webapp command=build

install-all: install-private install-public install-dev install-front build-front ## Install back and front dependencies

## Testing the project

test-front: ## Test front app
	make npm-run-webapp command=test:unit
	make npm-run-webapp command=coverage

## Running the project

run: create-venv build-front ## Run the full app
	. venv/bin/activate && \
	gunicorn

run-front: ## Run front app
	make npm-run-webapp command=dev	

## Deploying the project

cloud-deploy: ## Deploy the app in cloud build
ifndef hash
	project_version=$$(cat version.txt) && \
	echo Deploying version without hash: $$project_version && \
	cp deployables/${env}/app.yaml app.yaml && \
	cp deployables/${env}/gcloudignore-gae gcloudignore-gae && \
	gcloud app deploy --appyaml=app.yaml --ignore-file=gcloudignore-gae --version=$$project_version --no-promote .
else
	project_version=$$(cat version.txt)-$(hash) && \
	echo Deploying version with hash: $$project_version && \
	cp deployables/${env}/app.yaml app.yaml && \
	cp deployables/${env}/gcloudignore-gae gcloudignore-gae && \
	gcloud app deploy --appyaml=app.yaml --ignore-file=gcloudignore-gae --version=$$project_version --no-promote .
endif

local-deploy: ## Deploy the local version of the app
ifndef env
	$(error env value missing. Use: make deploy env={dev|au|pro} project={project})
else
ifndef project
	$(error project value missing. Use: make deploy env={dev|au|pro} project={project})
else
	gcloud builds submit --substitutions _BBVA_GAE_ENV=$(env) --project=$(project) --config=cloudbuild.yaml --ignore-file=.gcloudignore
endif
endif

promote-version: ## Promote a version to 100% of the traffic
ifndef hash
	project_version=$$(cat version.txt) && \
	echo Promoting version: $$project_version && \
	gcloud app services set-traffic ${service-name} --splits=$$project_version=1
else
	project_version=$$(cat version.txt)-$(hash) && \
	echo Promoting version: $$project_version && \
	gcloud app services set-traffic ${service-name} --splits=$$project_version=1
endif

## Auxiliary commands

npm-webapp:
ifeq ($(build_env), ci)
	npm $(command) --prefix webapp
else
	export NVM_DIR="${HOME}/.nvm" && . ${NVM_DIR}/nvm.sh && nvm exec ${WEBAPP_NODE_VERSION} npm $(command) --prefix webapp
endif

npm-run-webapp:
	make npm-webapp command="run $(command)"

get-tag-version: ## Get the tag version
	@project_version=$$(cat version.txt) && \
	echo v$$project_version

.PHONY: help
.DEFAULT_GOAL := help

help:
	@echo "Usage: make [target]"
	@echo ""
	@echo "Targets:"
	@echo ""
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-30s %s\n", $$1, $$2}' $(MAKEFILE_LIST)