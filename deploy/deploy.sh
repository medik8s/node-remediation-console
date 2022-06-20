#!bin/sh
if [ $# -eq 0 ]
  then
    echo "Usage: deploy.sh <image>"
fi
IMAGE=$1
PLUGIN_NAME="node-remediation-console-plugin"
oc process -f template.yaml \
  -p PLUGIN_NAME=$PLUGIN_NAME \
  -p NAMESPACE=$PLUGIN_NAME \
  -p IMAGE=$IMAGE \
  | oc create -f -
oc patch consoles.operator.openshift.io cluster \
 --patch '{ "spec": { "plugins": ['"${PLUGIN_NAME}"'] } }' --type=merge
