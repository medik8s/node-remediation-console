
sudo docker build -t $IMAGE .
sudo docker run -it --rm -d -p 9001:80 $IMAGE &
sudo docker push $IMAGE