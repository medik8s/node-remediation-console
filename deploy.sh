#!/bin/bash

if [ $# -eq 0 ]
  then
    echo "Usage: deploy.sh <target image>"
    exit 0
fi
oc process -f template.yaml  -p PLUGIN_NAME=node-remediation-console-plugin -p NAMESPACE=node-remediation-console-plugin -p IMAGE=$1 | oc create -f -
oc patch consoles.operator.openshift.io cluster  --patch '{ "spec": { "plugins": ["node-remediation-console-plugin"] } }' --type=merge
