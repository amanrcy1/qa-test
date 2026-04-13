FROM ubuntu:22.04

LABEL maintainer="qa-team"

# skip interactive prompts during apt install
ENV DEBIAN_FRONTEND=noninteractive

# system libs needed by Cypress to run headless Chrome
RUN apt-get update && apt-get install -y \
    curl wget git unzip gnupg ca-certificates \
    libgtk2.0-0 libgtk-3-0 libgbm-dev libnotify-dev \
    libnss3 libxss1 libasound2 libxtst6 xauth xvfb \
    && rm -rf /var/lib/apt/lists/*

# Java 17 — needed for TestNG/Maven
RUN apt-get update && apt-get install -y openjdk-17-jdk \
    && rm -rf /var/lib/apt/lists/*
ENV JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
ENV PATH="$JAVA_HOME/bin:$PATH"

# Maven — build tool for Java tests
ARG MAVEN_VERSION=3.9.6
RUN wget -q https://archive.apache.org/dist/maven/maven-3/${MAVEN_VERSION}/binaries/apache-maven-${MAVEN_VERSION}-bin.tar.gz \
    && tar -xzf apache-maven-${MAVEN_VERSION}-bin.tar.gz -C /opt \
    && ln -s /opt/apache-maven-${MAVEN_VERSION}/bin/mvn /usr/local/bin/mvn \
    && rm apache-maven-${MAVEN_VERSION}-bin.tar.gz

# Node.js 20 — needed for Cypress and API tests
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# Chromium browser — works on both amd64 and arm64 (Apple Silicon)
RUN apt-get update && apt-get install -y chromium-browser dbus dbus-x11 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# pre-install Cypress binary so pipeline runs are faster
RUN npm install -g cypress && npx cypress verify

# fix npm/cypress cache and dbus permissions for Jenkins (runs as uid 1000)
RUN mkdir -p /.npm /.cache /run/dbus /var/lib/dbus \
    && dbus-uuidgen > /var/lib/dbus/machine-id \
    && chmod -R 777 /.npm /.cache /run/dbus /var/lib/dbus

CMD ["bash"]
