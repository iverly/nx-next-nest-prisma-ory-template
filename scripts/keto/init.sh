#!/bin/sh
# This script is executed by the init container in the keto deployment.

set -e

# Check if file /tmp/.keto-init exists
if [ -f /tmp/.keto-init ]; then
    echo "Keto has already been initialized. Skipping init container."
    exit 0
fi

keto relation-tuple create /etc/config/keto/relation-tuples --insecure-disable-transport-security

# Create file /tmp/.keto-init
touch /tmp/.keto-init

echo "Keto has been initialized."
