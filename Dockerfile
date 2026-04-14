FROM ubuntu:22.04

LABEL maintainer="qa-team"

ENV DEBIAN_FRONTEND=noninteractive

# system libs needed by Cypress + Chromium headless
RUN apt-get update && apt-get install -y \
    curl wget git unzip gnupg ca-certificates \
    libgtk2.0-0 libgtk-3-0 libgbm-dev libnotify-dev \
    libnss3 libxss1 libasound2 libxtst6 xauth xvfb \
    && rm -rf /var/lib/apt/lists/*

# Java 17
RUN apt-get update && apt-get install -y openjdk-17-jdk \
    && rm -rf /var/lib/apt/lists/*
ENV JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
ENV PATH="$JAVA_HOME/bin:$PATH"

# Maven
ARG MAVEN_VERSION=3.9.6
RUN wget -q https://archive.apache.org/dist/maven/maven-3/${MAVEN_VERSION}/binaries/apache-maven-${MAVEN_VERSION}-bin.tar.gz \
    && tar -xzf apache-maven-${MAVEN_VERSION}-bin.tar.gz -C /opt \
    && ln -s /opt/apache-maven-${MAVEN_VERSION}/bin/mvn /usr/local/bin/mvn \
    && rm apache-maven-${MAVEN_VERSION}-bin.tar.gz

# Node.js 20
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# Chromium — works on amd64 and arm64, no dbus dependency issues
RUN apt-get update && apt-get install -y chromium-browser \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Permissions for Jenkins (runs as uid 1000)
RUN mkdir -p /.npm /.cache /.local /run/dbus /var/lib/dbus \
    && apt-get update && apt-get install -y dbus \
    && rm -rf /var/lib/apt/lists/* \
    && dbus-uuidgen > /var/lib/dbus/machine-id \
    && chmod -R 777 /.npm /.cache /.local /run/dbus /var/lib/dbus \
    && chmod 4755 /usr/bin/dbus-daemon

CMD ["bash"]
