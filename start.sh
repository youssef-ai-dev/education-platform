#!/bin/bash
while true; do
  cd /home/z/my-project
  node serve.js
  echo "Server died, restarting in 1s..."
  sleep 1
done
