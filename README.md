# dockerEventNotifications
Just a quick and dirty tool to pull messages from docker and send them over to a HTTP server 

# Run

```bash
docker build -t xantios/docker-events .
docker run -e TARGET=http://example.com:1337 -v /var/run/docker.sock:/var/run/docker.sock xantios/docker-events
```
