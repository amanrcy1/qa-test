FROM ubuntu:22.04

LABEL maintainer="qa-team"

ENV DEBIAN_FRONTEND=noninteractive

# system libs needed by Cypress + Chromium headless
RUN apt-get update && apt-get install -y \
    curl wget git unzip gnupg ca-certificates \
    libgtk2.0-0 libgtk-3-0 libgbm-dev libnotify-dev \
    libnss3 libxss1 libasound2 libxtst6 xauth xvfb \
    && rm -rf /var/lib/apt/lists/*

# Node.js 20
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Permissions for Jenkins (runs as uid 1000)
# Create jenkins user and messagebus user for dbus
RUN useradd -u 1000 -m jenkins \
    && mkdir -p /.npm /.cache /.local /run/dbus /var/lib/dbus \
    && apt-get update && apt-get install -y dbus \
    && rm -rf /var/lib/apt/lists/* \
    && dbus-uuidgen > /var/lib/dbus/machine-id \
    && chmod -R 777 /.npm /.cache /.local /run/dbus /var/lib/dbus

CMD ["bash"]
