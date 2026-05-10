#!/bin/bash
set -e

# .env file path
ENV_FILE="JobHuntX.API/.env"
ENV_SAMPLE="JobHuntX.API/.env.sample"

# Auto-generate .env if missing
if [ ! -f "$ENV_FILE" ]; then
    echo "Creating $ENV_FILE from $ENV_SAMPLE..."
    cp "$ENV_SAMPLE" "$ENV_FILE"
fi

# Export environment variables from .env if it exists
if [ -f "$ENV_FILE" ]; then
    echo "Loading environment variables from $ENV_FILE..."
    # Skip comments and empty lines, then export
    export $(grep -v '^#' "$ENV_FILE" | xargs)
fi

# Restore dotnet tools
echo "Restoring dotnet tools..."
dotnet tool restore

# Execute the main command (passed from docker-compose.yml command)
exec "$@"
