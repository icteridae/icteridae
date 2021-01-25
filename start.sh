#!/usr/bin/env bash

trap 'kill %1' SIGINT
./backend/manage.py runserver & yarn --cwd frontend/ start
