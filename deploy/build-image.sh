if [ $# -eq 0 ]
  then
    echo "Usage: build-image.sh <image>"
    exit 0
fi
IMAGE=$1
docker build -t $IMAGE .
docker push $IMAGE