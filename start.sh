#!/usr/bin/env bash

set -euo pipefail

CONFIG_FILE="variables.txt"

print_info() { printf '\033[0;36m[INFO]\033[0m %s\n' "$1"; }
print_success() { printf '\033[0;32m[SUCCESS]\033[0m %s\n' "$1"; }
print_error() { printf '\033[0;31m[ERROR]\033[0m %s\n' "$1"; }
print_warning() { printf '\033[0;33m[WARNING]\033[0m %s\n' "$1"; }

if [ ! -f "$CONFIG_FILE" ]; then
  print_error "Config file '$CONFIG_FILE' not found."
  exit 1
fi

print_info "Loading configuration from $CONFIG_FILE..."
while IFS='=' read -r key value || [ -n "${key:-}" ]; do
  case "${key:-}" in
    ''|\#*) continue ;;
  esac

  key=$(printf '%s' "$key" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')
  value=$(printf '%s' "${value:-}" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')

  if [ -n "$key" ]; then
    export "$key=$value"
    print_info "  - Setting $key=$value"
  fi
done < <(tr -d '\r' < "$CONFIG_FILE")

: "${JAVA:=java}"
: "${NEOFORGE_INSTALLER:=neoforge.jar}"
: "${RECOMMENDED_JAVA_VER:=21}"
: "${ACCEPT_EULA:=false}"
: "${AUTO_RESTART:=false}"
: "${RESTART_DELAY_SECONDS:=10}"

if [ -z "${JVM_ARGS:-}" ] || [ -z "${NEOFORGE_VERSION:-}" ]; then
  print_error "JVM_ARGS and NEOFORGE_VERSION must be set in $CONFIG_FILE."
  exit 1
fi

: "${NEOFORGE_INSTALLER_URL:=https://maven.neoforged.net/releases/net/neoforged/neoforge/$NEOFORGE_VERSION/neoforge-$NEOFORGE_VERSION-installer.jar}"

print_info "Checking Java existence..."
if ! command -v "$JAVA" >/dev/null 2>&1; then
  print_error "Java command '$JAVA' not found. Set JAVA in $CONFIG_FILE."
  exit 1
fi
print_success "Java found at: $(command -v "$JAVA")"

JAVA_FULL_VERSION_STRING=$("$JAVA" -version 2>&1)
JAVA_VER=$(printf '%s\n' "$JAVA_FULL_VERSION_STRING" | grep 'version' | sed -n 's/.*version "\(.*\)".*/\1/p')
MAJOR_VER=$(printf '%s' "$JAVA_VER" | cut -d'.' -f1)

print_info "Detected Java version: $JAVA_VER (major: $MAJOR_VER)"
if [ "$MAJOR_VER" != "$RECOMMENDED_JAVA_VER" ]; then
  print_error "Detected Java $MAJOR_VER, but Java $RECOMMENDED_JAVA_VER is required."
  exit 1
fi

NEOFORGE_ARGS="libraries/net/neoforged/neoforge/$NEOFORGE_VERSION/unix_args.txt"
if [ ! -f "$NEOFORGE_ARGS" ]; then
  print_warning "NeoForge argument file not found. Installing NeoForge server..."
  if [ ! -f "$NEOFORGE_INSTALLER" ]; then
    print_warning "NeoForge installer '$NEOFORGE_INSTALLER' not found. Downloading..."
    if command -v curl >/dev/null 2>&1; then
      curl -L --retry 3 --retry-connrefused -o "$NEOFORGE_INSTALLER" "$NEOFORGE_INSTALLER_URL"
    elif command -v wget >/dev/null 2>&1; then
      wget -O "$NEOFORGE_INSTALLER" "$NEOFORGE_INSTALLER_URL"
    else
      print_error "Neither curl nor wget is available. Download manually: $NEOFORGE_INSTALLER_URL"
      exit 1
    fi

    if [ ! -f "$NEOFORGE_INSTALLER" ]; then
      print_error "Download finished but '$NEOFORGE_INSTALLER' was not created."
      exit 1
    fi
  fi

  "$JAVA" -jar "$NEOFORGE_INSTALLER" --installServer

  if [ ! -f "$NEOFORGE_ARGS" ]; then
    print_error "NeoForge installation finished but '$NEOFORGE_ARGS' was not generated."
    exit 1
  fi
fi

if [ ! -f "user_jvm_args.txt" ]; then
  printf '%s\n' "$JVM_ARGS" > user_jvm_args.txt
  print_info "Created user_jvm_args.txt"
fi

if [ "$ACCEPT_EULA" = "true" ]; then
  if [ ! -f "eula.txt" ] || ! grep -qi "eula=true" "eula.txt"; then
    print_warning "Setting eula=true. Running the server means accepting the Minecraft EULA."
    printf 'eula=true\n' > eula.txt
  fi
else
  if [ ! -f "eula.txt" ] || ! grep -qi "eula=true" "eula.txt"; then
    print_error "eula.txt must contain eula=true. Set ACCEPT_EULA=true in $CONFIG_FILE or accept the EULA manually."
    exit 1
  fi
fi

while true; do
  print_success "All checks passed. Launching the server..."
  set +e
  "$JAVA" @user_jvm_args.txt @"$NEOFORGE_ARGS" "$@"
  server_exit_code=$?
  set -e

  if [ "$AUTO_RESTART" != "true" ]; then
    exit "$server_exit_code"
  fi

  print_warning "Server exited with code $server_exit_code. Restarting in $RESTART_DELAY_SECONDS seconds..."
  sleep "$RESTART_DELAY_SECONDS"
done
