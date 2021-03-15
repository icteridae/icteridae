#!/bin/bash

while ! curl http://db:5432 2>&1 | grep '52'
do
    echo 'Waiting for postgres'
    sleep 1
done

# Apply database migrations
echo "Apply database migrations"
python manage.py migrate

# Create local cache
echo "Create local cache"
python manage.py createcachetable

# Start server
echo "Starting server"
python manage.py runserver 0.0.0.0:8000