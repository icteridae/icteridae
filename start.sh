#!/usr/bin/env bash

trap 'kill %1' SIGINT
<<<<<<< HEAD
./backend/manage.py runserver & yarn --cwd frontend/ start
=======
./backend/manage.py runserver & yarn --cwd frontend/ start
>>>>>>> feature
