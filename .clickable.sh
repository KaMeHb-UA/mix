#!/usr/bin/env bash

cd `dirname "$0"`

if [ ! -f .venv/bin/activate ]; then
    python3 -m venv .venv --system-site-packages
fi

source ./.venv/bin/activate

pip install clickable-ut --upgrade

exec clickable "$@"
