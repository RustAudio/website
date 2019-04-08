#!/usr/bin/env bash
ZOLA_VERSION="0.6.0"
curl -sL "https://github.com/getzola/zola/releases/download/v${ZOLA_VERSION}/zola-v${ZOLA_VERSION}-x86_64-unknown-linux-gnu.tar.gz" | tar zxv && ./zola build
