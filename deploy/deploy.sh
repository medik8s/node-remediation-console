#!/bin/bash

if [ $# -eq 0 ]
  then
    echo "Usage: deploy.sh <image>"
    exit 0
fi
IMAGE=$1
PLUGIN_NAME="node-remediation-console-plugin"
BASEDIR=$( dirname $0 )
oc process -f ${BASEDIR}/template.yaml  -p PLUGIN_NAME=node-remediation-console-plugin -p NAMESPACE=node-remediation-console-plugin -p IMAGE=$IMAGE | oc create -f -
oc patch consoles.operator.openshift.io cluster  --patch '{ "spec": { "plugins": ["node-remediation-console-plugin"] } }' --type=merge
