# -*- coding: utf-8 -*-

import subprocess

import requests

GCLOUD_ACCOUNT = None
GCLOUD_PROJECT = None
USER_IP = None


def get_gcloud_account():
    global GCLOUD_ACCOUNT
    if not GCLOUD_ACCOUNT:
        ps = subprocess.Popen(
            'gcloud config list account --format "value(core.account)"',
            stderr=subprocess.STDOUT,
            shell=True,
            stdout=subprocess.PIPE)
        GCLOUD_ACCOUNT = ps.stdout.readline().decode().strip()
    return GCLOUD_ACCOUNT


def get_gcloud_project():
    global GCLOUD_PROJECT
    if not GCLOUD_PROJECT:
        ps = subprocess.Popen(
            'gcloud config list project --format "value(core.project)"',
            stderr=subprocess.STDOUT,
            shell=True,
            stdout=subprocess.PIPE)
        GCLOUD_PROJECT = ps.stdout.readline().decode().strip()
    return GCLOUD_PROJECT


def get_user_ip():
    global USER_IP
    if not USER_IP:
        USER_IP = requests.get('http://ipinfo.io/json').json()['ip']
    return USER_IP


# Config settings
# https://docs.gunicorn.org/en/stable/settings.html#settings
bind = ':8080'
capture_output = True
loglevel = 'debug'
raw_env = [
    "BBVA_ENV=dev",
    "APP_PROPERTIES_PATHS=./lib/fga/resources:resources",
    f"GAE_APPLICATION={get_gcloud_project()}",
    f"GOOGLE_CLOUD_PROJECT={get_gcloud_project()}",
    "GAE_SERVICE=default",
    "GAE_VERSION=0-1-0",
    "SERVER_SOFTWARE=dev-server",
    "GAE_ENV=fga-local",
    f"REQUESTOR={get_gcloud_account()}"
]
reload = True
timeout = 60
workers = 1
wsgi_app = 'main:app'


def pre_request(worker, req):
    req.headers.append(('X_FORWARDED_FOR', get_user_ip(),))
