#!/bin/bash

echo "yes" | python manage.py flush
python manage.py makemigrations
python manage.py migrate
