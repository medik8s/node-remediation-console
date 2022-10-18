# SHELL defines bash so all the inline scripts here will work as expected.
SHELL := /bin/bash

DEFAULT_VERSION := 0.0.1
VERSION ?= $(DEFAULT_VERSION)
export VERSION

# Override this when building images for dev only!
IMAGE_REGISTRY ?= quay.io/medik8s

# For the default version, use 'latest' image tags.
# Otherwise version prefixed with 'v'
ifeq ($(VERSION), $(DEFAULT_VERSION))
IMAGE_TAG = latest
else
IMAGE_TAG = v$(VERSION)
endif
export IMAGE_TAG

# Image pullspec to use for all building/pushing image targets
IMG ?= $(IMAGE_REGISTRY)/node-remediation-console:$(IMAGE_TAG)

# Build the docker image
.PHONY: docker-build
docker-build:
	podman build -t ${IMG} .

# Push the docker image
.PHONY: docker-push
docker-push:
	podman push ${IMG}