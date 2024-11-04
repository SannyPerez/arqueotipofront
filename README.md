# BBVA FGA Front Archetype for Python 3
version: 2.1.0

This section covers the basics of how to use the Python 3 Archetype for BBVA JavaScript front applications deployed on
Google App Engine using the [Python 3 Standard Environment]. This archetype contains a set of classes and configuration
files that will help you with the development of this kind of applications.

## Prerequisites

These are the necessary tools in order to use this archetype.

- [Artifactory]
- [Bitbucket]
- [Google DEV account for DEV environment](https://platform.bbva.com/gcp/documentation/1Et3h3LJibvYtQ5EVStNFcfuMzOWE86MRb55dYHljiYk/guides/dev-environment-user)
- gcloud installed and configured
  * `gcloud auth application-default login` with dev.bbva.com account
  * `gcloud config set project <project_id>`
- python 3.11
- virtualenv
- [nvm](https://github.com/nvm-sh/nvm#intro) as node version manager.
- Node version required must be installed with nvm. In this case 18. `nvm install 18`

## Makefile

In the Makefile you can find different commands that help with the archetype tasks. These commands can be adapted to the needs of each project, or even not used at all.

This file defines the webapp node version:
```makefile
WEBAPP_NODE_VERSION := 18
```

### Install all dependencies (front and back)

```bash
make install-all
```

### Running locally

```bash
make run
```

### Running tests

```bash
make test
```

with coverage
```bash
make coverage
```

*Front commands*

### Install front dependencies

```bash
make install-front
```

### Test front

```bash
make test-front
```

### Build front

```bash
make build-front
```

### Run front

```bash
make run-front
```

## Deploy

To deploy:

```bash
make deploy env={dev|au|pro} project={project-id}
```

### Deploy only app

When the app is deployed, the app is packaged and cloud build does the rest.

```bash
make deploy env={dev|au|pro} project={project-id}
```

### Deploy only queue
```bash
gcloud app deploy deployables/{dev}/queue.yaml
```

### Deploy only datastore indexes
```bash
gcloud app deploy deployables/{dev}/index.yaml
```

### Deploy only cron jobs
```bash
gcloud app deploy deployables/{dev}/cron.yaml
```

### Deploy only dispatch configuration
```bash
gcloud app deploy deployables/{dev}/dispatch.yaml
```

## Features

### FGA

This archetype includes the Framework for Google Applications (FGA). You can read its documentation [here][fga-docs].

### Structure

The next section documents the directory layout:

* deployables: GAE configuration files by environment
* resources: properties files by environment for the applicaton.
* tests: python tests
* webapp: Static Web

### Session

By default, app require user login. You can find data about the current logged user in constant `userSession`. In
addition to this, you can retrieve the current environment in constant `environment` (dev | au | pro).

### How to use User Roles

#### Configure Roles

Inside the folder resources we have enviroments, so please select your enviroment and add the next property
in `properties.yaml`

```yaml
soyo:
  roles: True
```

#### Get Roles

Find roles inside the constant `userSession.soyoRoles`.

### How to use Connectors

All front archetypes have the OAuth connector feature. The OAuth connector is a proxy that facilitates calls to other
APIs as well as their security. These calls are signed with OAuth 2.0 in the frontback (avoiding exposing any
credentials in the front).

By default, the connector is enabled for Gateway host and the alias configured. This is defined in the properties.yaml
file for every environment.

```properties
connector_uris:{alias}
{alias}:https://dev-bbva-gateway.appspot.com/{alias}
```

One example:

First of all, we need to configure our alias (API) that we are going to consume.

```properties
connector_uris:gdrive
gdrive:https://dev-bbva-gateway.appspot.com/gdrive
```

With the above configuration, to make a call to GDrive's /v3/files
service (https://dev-bbva-gateway.appspot.com/gdrive/v3/files), you could use the following URL:

```http
https://<my-project-id>.appspot.com/c/gdrive/v3/files
```

or from the front Javascript

```http
/c/gdrive/v3/files
```

You can add more connectors if you want by using the properties.yaml file for the corresponding environment.

```properties
connector_uris:gdrive, my_api_v1
gdrive:https://dev-bbva-gateway.appspot.com/gdrive
my_api_v1:https://dev-bbva-gateway.appspot.com/my_api_v1
```

## CI/CD

In order to use CI/CD, you have to configure the [Jenkinsfile](Jenkinsfile) file.

* Set the “UUAA” environment variable to the project UUAA.
* Set the “SAMUEL_PROJECT_NAME” environment variable to the name that it will have in the Samuel console.

The global timeout is set by default to 60 minutes for the entire pipeline.

The fga-cli image version used by default is `latest`. If you prefer, you can set a specific version. This change has to
be applied in both [Jenkinsfile](Jenkinsfile) and [cloudbuild.yaml](cloudbuild.yaml).

The default directory used for [Sonar](sonar-project.properties) is [src](src), change it according to your project.

## Versioning

GCP recommend follows [Semantic Versioning](http://semver.org/).

## Change log

See [CHANGELOG](CHANGELOG.md).

## Support

For any problem or bug, please contact with BBVA Google Cloud Platform Team following this [template](https://platform.bbva.com/gcp/documentation/1u80anICjn_zifhlN3IM4dyuutbNuCEnl682jU4B1h_M/procedures/issue-support-request).

## Examples

### `~/.npmrc` file

```text
registry=https://registry.npmjs.org/

@gcp:registry=https://artifactory.globaldevtools.bbva.com/artifactory/api/npm/gl-gcp-global-npm-local/
//artifactory.globaldevtools.bbva.com/artifactory/api/npm/gl-gcp-global-npm-local/:_password=<BASE64_PASSWORD>
//artifactory.globaldevtools.bbva.com/artifactory/api/npm/gl-gcp-global-npm-local/:username=<USERNAME>
//artifactory.globaldevtools.bbva.com/artifactory/api/npm/gl-gcp-global-npm-local/:email=youremail@email.com
//artifactory.globaldevtools.bbva.com/artifactory/api/npm/gl-gcp-global-npm-local/:always-auth=true
```


[Python 3 Standard Environment]: https://cloud.google.com/appengine/docs/standard/python3

[fga-docs]: https://platform.bbva.com/gcp/documentation/186IMU0iLBahnAAVXsGvLWdH3NvBgk_wGhnI4aRnSpko/technical-documentation/frameworks/fga-core/runtimes/python/getting-started

[Artifactory]: https://platform.bbva.com/en-us/developers/engines/gcp/documentation/aditional-documentation/procedures/artifactory

[Bitbucket]: https://platform.bbva.com/gcp/documentation/1ORjud_IkSWnbawHbSpggSY2Uk0RrH1iTFQqPDQ7F-04/developer-tools/bitbucket
