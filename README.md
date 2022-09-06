# Node Remediation Console Plugin
Provides a user friendly UI for the form, list and details view of the NodeHealthCheck CRD.
The [NodeHealthCheck Operator](https://github.com/medik8s/node-healthcheck-operator) should be installed for the UI to be exposed.

## Local development

In one terminal window, run:

1. `yarn install`
2. `yarn run start`

In another terminal window, run:

1. `oc login` (requires [oc](https://console.redhat.com/openshift/downloads) and an [OpenShift cluster](https://console.redhat.com/openshift/create))
2. `yarn run start-console` (requires [Docker](https://www.docker.com) or [podman 3.2.0+](https://podman.io))

This will run the OpenShift console in a container connected to the cluster
you've logged into. The plugin HTTP server runs on port 9001 with CORS enabled.
Navigate to <http://localhost:9000/example> to see the running plugin.


## Deployment on cluster

## Docker image

Before you can deploy your plugin on a cluster, you must build an image and
push it to an image registry.

1. Build the image:
   ```sh
   docker build -t quay.io/my-repositroy/node-remediation-console-plugin:latest .
   ```
2. Run the image:
   ```sh
   docker run -it --rm -d -p 9001:80 quay.io/my-repository/node-remediation-console-plugin:latest
   ```
3. Push the image:
   ```sh
   docker push quay.io/my-repository/node-remediation-console-plugin:latest
   ```

NOTE: If you have a Mac with Apple silicon, you will need to add the flag
`--platform=linux/amd64` when building the image to target the correct platform
to run in-cluster.

## Deployment on cluster

After pushing an image with your changes to a registry, you can deploy the
plugin to a cluster by instantiating the provided
[OpenShift template](template.yaml). It will run a light-weight nginx HTTP
server to serve your plugin's assets.

```sh
oc process -f template.yaml \
  -p PLUGIN_NAME=node-remediation-console-plugin \
  -p NAMESPACE=node-remediation-console-plugin \
  -p IMAGE=quay.io/my-repository/node-remediation-console-plugin:latest \
  | oc create -f -
```
# Tests

Currently the tests run on development environment

1. Setup Local development
2. On a new terminal run `oc login` and `yarn test` 