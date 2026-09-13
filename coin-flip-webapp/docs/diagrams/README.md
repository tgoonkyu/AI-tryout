# Generated PlantUML Diagrams

This directory contains PNG images generated from PlantUML diagrams in the documentation files.

## Diagram Files (34 total)

### Architecture Diagrams
- `High-Level-Architecture.png` - Overall system architecture
- `Backend-Layers.png` - Backend layer structure
- `Domain-Model.png` - Domain model and entities
- `Frontend-Architecture.png` - Frontend component structure
- `State-Management.png` - State management flow
- `Deployment-Architecture.png` - Deployment and environment structure

### Flow Diagrams
- `Authentication-Flow.png` - User authentication process
- `Coin-Flip-Flow.png` - Coin flip operation flow
- `History-Flow.png` - History retrieval flow
- `Statistics-Flow.png` - Statistics calculation flow
- `End-to-End-Flow.png` - Complete user journey
- `Request-Lifecycle.png` - HTTP request lifecycle
- `Flip-Creation-Flow.png` - Flip creation process
- `Flip-Interaction.png` - User flip interaction
- `Guest-User-Flow.png` - Guest user workflow
- `Registered-User-Flow.png` - Registered user workflow

### Service Diagrams
- `Service-Architecture.png` - Service layer architecture
- `Service-Interactions.png` - Service interaction patterns
- `AuthService-Flow.png` - Authentication service flow
- `FlipService-Flow.png` - Flip service operations
- `StatsService-Flow.png` - Statistics service flow

### Security Diagrams
- `Security-Architecture.png` - Security architecture overview
- `Threat-Model.png` - Threat model and mitigation
- `Authentication-Security-Flow.png` - Secure authentication flow

### Testing Diagrams
- `Testing-Architecture.png` - Testing framework structure
- `Test-Strategy-Flow.png` - Testing strategy and approach
- `Testing-Pyramid.png` - Test coverage pyramid
- `Backend-Testing-Flow.png` - Backend testing workflow

### Database & Navigation
- `Database-Schema.png` - Database schema and relationships
- `Navigation-Flow.png` - Application navigation structure

### Other
- `User-Personas.png` - User personas and capabilities
- `Feature-Use-Cases.png` - Feature use cases
- `Phase-Dashboard.png` - Project phase dashboard
- `Docker-Compose.png` - Docker compose architecture

## How to Regenerate

If you need to regenerate these diagrams:

```powershell
# From the docs/ directory
cd docs

# Generate all diagrams from markdown files
java -jar plantuml.jar -tpng -o diagrams *.md

# Or use the generation script
.\generate-diagrams.ps1
```

## Updating Markdown Files

To replace PlantUML code blocks with image references:

```powershell
.\update-markdown.ps1
```

This will automatically find all PlantUML blocks in `.md` files and replace them with image links.

## Requirements

- **Java** (version 8 or higher) - Required to run PlantUML
- **plantuml.jar** - Located in the `docs/` directory

## Notes

- All diagrams are generated as PNG format for maximum compatibility
- Images are version controlled and committed to the repository
- No external servers or plugins required to view diagrams
- Works in any Markdown viewer (VS Code, GitHub, Azure DevOps, etc.)
