# Multi-stage Dockerfile for Spring Boot Backend
# Supports both development and production builds

# Development stage
FROM eclipse-temurin:21-jdk-alpine AS development

# Set working directory
WORKDIR /app

# Install required tools
RUN apk add --no-cache curl bash dos2unix

# Install Maven wrapper dependencies
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./

# Convert line endings and make Maven wrapper executable
RUN dos2unix ./mvnw && chmod +x ./mvnw

# Download dependencies (cached layer)
RUN ./mvnw dependency:go-offline -B || ./mvnw dependency:resolve -B

# Copy source code
COPY src/ src/

# Expose application port and debug port
EXPOSE 8080 5005

# Development command with hot reload
CMD ["./mvnw", "spring-boot:run", "-Dspring-boot.run.jvmArguments=-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=*:5005"]

# Build stage
FROM eclipse-temurin:21-jdk-alpine AS build

WORKDIR /app

# Install required tools
RUN apk add --no-cache curl bash dos2unix

# Copy Maven wrapper and dependencies
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./

# Convert line endings and make Maven wrapper executable
RUN dos2unix ./mvnw && chmod +x ./mvnw

# Download dependencies
RUN ./mvnw dependency:go-offline -B || ./mvnw dependency:resolve -B

# Copy source and build
COPY src/ src/
RUN ./mvnw package -DskipTests -B

# Production stage
FROM eclipse-temurin:21-jre-alpine AS production

# Create non-root user for security
RUN addgroup -g 1001 -S coinflip && \
    adduser -S coinflip -u 1001 -G coinflip

# Set working directory
WORKDIR /app

# Copy built JAR from build stage
COPY --from=build --chown=coinflip:coinflip /app/target/*.jar app.jar

# Switch to non-root user
USER coinflip

# Expose application port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/api/actuator/health || exit 1

# Production command
ENTRYPOINT ["java", "-jar", "/app/app.jar"]