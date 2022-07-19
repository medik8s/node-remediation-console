#!/bin/bash

if [ $# -eq 0 ]
  then
    echo "Usage: deploy.sh <image>"
    exit 0
fi
IMAGE=$1
PLUGIN_NAME="node-remediation-console-plugin"
BASEDIR=$( dirname $0 )
oc process -f ${BASEDIR}/template.yaml \
  -p PLUGIN_NAME=$PLUGIN_NAME \
  -p NAMESPACE=$PLUGIN_NAME \
  -p IMAGE=$IMAGE \
  | oc create -f -
DATA='{ "spec": { "plugins": ['"\"${PLUGIN_NAME}\""'] } }'
oc patch consoles.operator.openshift.io cluster \
 --patch "$DATA" --type=merge
