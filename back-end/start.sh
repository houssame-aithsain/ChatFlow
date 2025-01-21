#!/bin/bash

python manage.py makemigrations user chat
python manage.py migrate
