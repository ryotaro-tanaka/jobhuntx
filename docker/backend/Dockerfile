FROM mcr.microsoft.com/dotnet/sdk:8.0

# Set working directory
WORKDIR /src

# The source code will be mounted as a volume in docker-compose
# So we don't need to COPY files here for development.

# Ensure dotnet tools can be restored if the config file is present
# Note: This is a placeholder for future enhancements in Phase 2

# Copy and set up entrypoint script
COPY ./docker/backend/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
