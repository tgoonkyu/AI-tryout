# Coin Flip Application - Copilot Instructions

## Technical Stack

### Backend
-- **Language**: Java 17
- **Framework**: Spring Boot 3.x (latest stable)
- **Build Tool**: Maven 3.9+
- **Database**: PostgreSQL 16
- **ORM**: Spring Data JPA / Hibernate
- **Authentication**: JWT (JSON Web Tokens)
- **Testing**: JUnit 5, Mockito
- **API Style**: RESTful

### Frontend
- **Framework**: React (latest stable)
- **Language**: TypeScript
- **UI Library**: Material-UI (MUI)
- **State Management**: Context API
- **Animation**: CSS3 Keyframes (rotateX, rotateY transforms)
- **Testing**: Playwright with MCP integration
- **Build Tool**: Vite
- **Audio**: HTML5 Audio API

### Infrastructure
- **Containerization**: Docker
- **Orchestration**: Docker Compose
- **Database**: PostgreSQL 16 (containerized)
- **Development**: Hot reload enabled for both FE and BE

---

## Project Overview

### Application Purpose
A web-based coin flip application that provides:
- Random coin flip with 3D animation (1 second, synchronized with coin-rattle.mp3)
- Sound effects (flip start, coin rattling, result)
- Flip history tracking with lazy loading
- Statistics dashboard (heads/tails ratio, time-based stats)
- Guest mode (session-based) and registered user mode
- Light/Dark theme toggle

### System Requirements
- **Minimum Resolution**: 1920x1080 (Full HD)
- **Supported Browser**: Google Chrome (latest stable version)
- **Note**: Optimized for desktop experience; mobile support in future phases

### Target Users
1. **Guest Users**: Quick coin flips without registration, session-only history
2. **Registered Users**: Persistent history, detailed statistics, cross-device access
3. **Admin Users** (Future): System-wide analytics, user management

---

## Core Features (MVP)

### 1. Coin Flip Interface
- Single "Flip" button prominently displayed
- 3D coin animation (1 second, synchronized with coin-rattle.mp3)
- Random 50/50 result generation
- Clear result display (Heads/Tails)
- Skip animation toggle (session-based preference)
- **Current Implementation:**
  - Glass-morphism card with gradient background
  - Responsive sizing: minWidth 280px (xs), 350px (sm), maxWidth 450px
  - Enhanced padding: p: { xs: 5, sm: 6 }, py: { xs: 6, sm: 8 }
  - Custom SVG coin faces: 120px (mobile) / 150px (desktop)
    - **Heads**: Gold coin, hex color FFD700, with head silhouette profile
    - **Tails**: Silver coin, hex color C0C0C0, with abstract graffiti design
  - Skip animation toggle positioned BELOW flip button
  - Button with gradient, shadows, hover effects
  - Button shows "🎲 Flipping..." with pulse animation when disabled during flip
  - Toggle label: "⚡ Skip Animation"
- **Coin Animation System:**
  - **Single Image Approach**: Direct image source switching based on state (no 3D card flip)
  - **Image Selection Logic**:
    - During flip: Alternates between coin-heads.svg and coin-tails.svg every 250ms
    - After result: Shows correct coin face (HEADS → coin-heads.svg, TAILS → coin-tails.svg)
    - Idle/Default: Shows coin-heads.svg
  - **Idle State (before first flip)**: Simple Y-axis rotation (0° → 180° → 360°), 3s loop, linear timing
    - Face switches at 90° and 270° (when coin is edge-on/thin line)
    - Initial switch at 0.75s, then every 1.5s thereafter
    - Synchronized with CSS animation for seamless appearance
  - **Flipping State**: 1s infinite 3D tumbling (rotateX + rotateY), face alternates every 250ms via state, duration matches coin-rattle.mp3
  - **Result Display**: 1s bounce reveal with scale (0.7 → 1.25 → 0.95 → 1) and opacity fade
  - **Skip Animation**: Captured at flip initiation (resultAnimationSkipped state) to prevent toggle from changing displayed result
  - All animations use cubic-bezier easing for smooth, physics-like motion
  - No mirroring or backfaceVisibility complexity

### 2. Sound Effects
- Flip start sound (on button click) ✅
- Coin rattling sound during animation (1s loop) ✅
- Result announcement sound ✅
- Mute/unmute toggle in navigation bar ✅
- Persistent preferences (localStorage) ✅
- **Implementation**: HTML5 Audio API in `SoundContext.tsx`
- **Files**: flip-start.mp3, coin-rattle.mp3, flip-result.mp3 (synced from resources/)

### 3. Theme Support
- Light theme (default)
- Dark theme
- Theme toggle button on every page
- Theme preference saved (localStorage for guests, DB for users)

### 4. User Management
- **Guest Mode**: No login, session-based history in localStorage
  - SessionId automatically generated and stored in localStorage
  - SessionId cleared on login/register to prevent history conflicts
  - New sessionId generated after logout for fresh guest session
- **Registration**: Email/username + password (min 8 chars)
- **Login**: JWT-based authentication with 24-hour expiration
- **Profile**: User details, statistics, reset history option
- **Session Management**: 
  - Login/Register clears guest sessionId to avoid mixing guest/user history
  - Logout clears sessionId to ensure fresh guest session with blank history
  - CoinFlip component regenerates sessionId reactively when cleared

### 5. Flip History Dialog
- **Display Pattern**: Modal dialog (not separate page navigation)
- **Table Format**: Serial No. | Result (as Chips) | Timestamp (dd/mm/yyyy hh:mm:ss)
- **Infinite Scroll**: Seamless loading, no pagination buttons
- **Dynamic Height**: 3-9.5 rows visible (53px per row calculation)
- **Visual Design**:
  - Sticky table header with primary blue gradient and white text
  - Result display as colored Chips (HEADS = primary blue, TAILS = secondary purple)
  - TableSortLabel showing descending timestamp sort indicator
  - Row hover effects for better interactivity
  - Compact "No more entries" indicator (40px) at bottom
- **Behavior**:
  - Initial load: 10 items
  - Auto-scroll to top on dialog open
  - Load more on scroll near bottom (100px threshold)
  - Loading state with CircularProgress
  - Total count label: "X total coin-flips" in primary color
- **Actions**: Clear history button (logged-in users only, top right of dialog)
- **Guest vs User**: Session-only history vs persistent database history
- **Component**: `HistoryDialog.tsx` with useRef for scroll container

### 6. Statistics Dashboard (Profile Page)
- **User Info Section**:
  - Gradient purple header (135deg: purple shades)
  - Icon badge system with colored circles:
    - Badge icon (green) - User ID
    - Person icon (blue) - Username  
    - Email icon (purple) - Email address
  - Grid layout (3 columns, responsive)
  - Elevated Paper card with shadow
  - Clear typography with colored values
  - Back navigation button (top right)
- **Statistics Display**:
  - Total flip count with gradient cards
  - Heads to Tails ratio with colored Chips
  - Time-based breakdown cards:
    - Today's statistics with info color left border
    - This week's statistics with warning color left border
    - This month's statistics with success color left border
  - Each card shows flip count with appropriate Chip color
  - Reduced padding (py: 1.2, px: 1.8) to eliminate scrollbar on 1920x1080 displays
- **Actions**: Reset History button (inline with Statistics heading)
- **Guest View**: Simplified statistics (flip count only)
- **Future**: Multiple chart types (pie, line, bar)

---

## Navigation Structure

### Main Page
- Coin flip button with 3D animation
- Theme toggle button
- Skip animation toggle (positioned below flip button)
- Mute/unmute sound button
- History button (opens modal dialog, not page navigation)
- **Layout Hierarchy:**
  1. Coin icon (4-5rem, spinning during flip)
  2. Result display / "Flipping..." text
  3. Flip button (primary action)
  4. Skip animation toggle (secondary control)

### History Dialog (Modal)
- Flip history table with infinite scroll
- Clear history button (logged-in users only, top right)
- Close button to dismiss dialog
- Dynamic height based on content (3-9.5 rows)
- Sticky table header with sort indicator

### Profile Page (Logged-in Users)
- User details (username, email, join date)
- Statistics dashboard with graphical display
- Reset history button
- Theme preference

### Login/Register Pages
- Simple authentication forms
- Form validation
- Error handling

### Future: Admin Page
- Dynamic access for users marked as admin
- System-wide analytics
- User management

---

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login (returns JWT)
- `POST /api/auth/logout` - User logout
- `GET /api/auth/validate` - Token validation

### Coin Flip
- `POST /api/flip` - Perform coin flip
  - Request: `{ userId?: string, sessionId?: string }`
  - Response: `{ result: 'HEADS' | 'TAILS', timestamp: string, flipId: string }`

### History
- `GET /api/history?page=0&size=10&sort=createdAt,desc` - Get flip history
- `DELETE /api/history` - Clear user's flip history (not app-wide)

### Statistics
- `GET /api/stats/summary` - Get user statistics
  - Response: `{ totalFlips, headsCount, tailsCount, ratio, todayCount, weekCount, monthCount }`

### User Profile
- `GET /api/user/profile` - Get user details
- `PUT /api/user/profile` - Update profile (future)

### Admin (Future)
- `GET /api/admin/stats` - System-wide statistics
- `GET /api/admin/users` - User management
- `DELETE /api/admin/users/{userId}` - Delete user

---

## Database Schema

### Users Table
```sql
users (
    user_id UUID PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_admin BOOLEAN DEFAULT FALSE
)
```

### Flips Table
```sql
flips (
    flip_id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(user_id),
    session_id VARCHAR(100), -- For guest users
    result VARCHAR(10) NOT NULL, -- 'HEADS' or 'TAILS'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_created (user_id, created_at DESC),
    INDEX idx_session_created (session_id, created_at DESC)
)
```

---

## Testing Strategy

### Frontend Testing (Playwright with MCP)
- **Unit Tests**: Component logic, utilities, hooks
- **Integration Tests**: User flows, API integration
- **E2E Tests**: Complete user journeys
  - Guest user flip and view history
  - User registration and login
  - Flip with authentication
  - View statistics
  - Theme switching
  - Clear history
- **Coverage Target**: 85%+

### Backend Testing (JUnit 5)
- **Unit Tests**: Service layer, utilities, business logic
- **Integration Tests**: Repository tests, API endpoints
- **API Tests**: Contract validation, request/response
- **Test Scenarios**:
  - Random flip generation (50/50 distribution)
  - User authentication flow
  - History pagination
  - Statistics calculation
  - JWT token validation
- **Coverage Target**: 90%+

---

## Future Features (Post-MVP)

### Phase 2
- WebSocket for real-time updates
- Advanced filtering (date range, result type)
- Custom themes and color schemes
- Export history (CSV/JSON)
- Multiple chart options for statistics

### Phase 3
- Admin dashboard with full features
- System-wide analytics
- User management (ban, delete)
- Guest to registered user conversion
- Social features (leaderboards)

### Phase 4
- Mobile app (React Native)
- Coin customization options
- Multiple coin types (dice, spinners)
- Achievements and badges
- Multi-language support

---

## UI/UX Design Patterns

### Modal Dialogs
- **Usage**: For secondary views that maintain main page state
- **Example**: History Dialog accessed from main page
- **Implementation**: Material-UI Dialog component with state management in Layout
- **Best Practices**: 
  - Close buttons or dismiss on backdrop click
  - Auto-scroll to relevant content on open
  - Appropriate z-index for overlay

### Infinite Scroll
- **Usage**: Long lists of chronological data (history entries)
- **Implementation**: useRef for scroll container, custom scroll handler
- **Trigger**: Load more when scrollTop + clientHeight >= scrollHeight - 100px
- **Visual Feedback**: Loading spinner, "No more entries" indicator
- **Best Practices**:
  - Initial load of 10-20 items
  - Batch loading for performance
  - Loading state to prevent duplicate requests

### Dynamic Height System
- **Usage**: Content-aware dialog sizing
- **Calculation**: `minHeight: ${53 + (Math.min(Math.max(itemCount, 3), 9.5) * 53)}px`
- **Min/Max**: 3 rows minimum, 9.5 rows maximum (partial 10th row hints scrollability)
- **Row Height**: Standardized at 53px for table rows
- **Benefits**: Avoids fixed heights that waste space or cause scrolling

### Gradient Headers
- **Usage**: Visual hierarchy and modern aesthetics
- **Primary Gradient**: Linear 135deg purple shades (purple theme)
- **Secondary Gradient**: Primary blue for table headers
- **Implementation**: `background: 'linear-gradient(135deg, color1, color2)'`
- **Text Color**: Always white for contrast on dark gradients

### Icon Badge System
- **Usage**: Clear visual indicators for different data types
- **Pattern**: Circular colored background with Material-UI icon
- **Color Coding**:
  - Green: User ID (Badge icon)
  - Blue: Username (Person icon)
  - Purple: Email (Email icon)
- **Layout**: Grid-based with labels and values
- **Typography**: Label in muted color, value in primary text

### Colored Chips
- **Usage**: Display categorical data (HEADS/TAILS, status indicators)
- **Color Mapping**:
  - Primary (blue): HEADS result
  - Secondary (purple): TAILS result
  - Success (green): Positive states
  - Error (red): Negative states
- **Benefits**: Quick visual scanning, color consistency

### Sticky Table Headers
- **Usage**: Long scrollable tables
- **Implementation**: `position: 'sticky', top: 0, zIndex: 1`
- **Design**: Colored background (primary blue) with white text
- **Features**: TableSortLabel for sort direction indication
- **Benefits**: Context retention during scroll

### Card-Based Layouts
- **Usage**: Grouping related information with visual separation
- **Components**: Material-UI Paper with elevation
- **Styling**: Rounded corners, shadows, padding
- **Hierarchy**: Cards within cards for nested sections
- **Responsive**: Grid system for multi-column layouts

### Loading States
- **Usage**: Async operations (API calls, data loading)
- **Components**: CircularProgress (spinner), Skeleton loaders
- **Placement**: Center of container or inline with content
- **Best Practices**: Always provide feedback for operations > 300ms

### Material-UI Best Practices
- **Theme Integration**: Use theme colors via `color="primary"` not hardcoded hex
- **Spacing**: Use theme spacing scale (`spacing(2)` = 16px)
- **Typography**: Use Typography component with variant prop
- **Icons**: Import from `@mui/icons-material`
- **Responsive**: Use Grid with xs, sm, md, lg, xl breakpoints
- **Accessibility**: Proper ARIA labels, keyboard navigation support

---

## Resource Management

### Centralized Asset Structure

**Philosophy**: Single source of truth for all project assets

All static resources (images, sounds, 3D models) are stored centrally in the `resources/` directory. The frontend automatically syncs required assets to `public/` before development and build operations.

### Directory Structure
```
resources/                          # Source of truth (version controlled)
├── images/                         # SVG and image assets
│   ├── coin-heads.svg             # Gold coin face
│   └── coin-tails.svg             # Silver coin face
├── sounds/                         # Audio files
│   ├── flip-start.mp3
│   ├── coin-rattle.mp3
│   └── flip-result.mp3
└── 3d-models/                     # Future 3D assets

frontend/public/                    # Auto-synced (not directly edited)
├── coin-heads.svg                 # Copied from resources/images/
├── coin-tails.svg                 # Copied from resources/images/
└── sounds/                        # Copied from resources/sounds/
    ├── flip-start.mp3
    ├── coin-rattle.mp3
    └── flip-result.mp3
```

### Sync Mechanism

**Automatic Sync**: Runs before dev server and production build
- Script: `frontend/scripts/sync-resources.js`
- Trigger: `predev` and `prebuild` hooks in package.json
- Cross-platform: Node.js script (works on Windows, macOS, Linux)

**Manual Sync**: 
```bash
cd frontend
npm run sync-resources
```

### Adding New Resources

1. **Add file** to appropriate `resources/` subdirectory
2. **Update sync script** (if new file type or location)
3. **Run sync**: `npm run sync-resources` or restart dev server
4. **Commit to git**: Only commit files in `resources/`, not `public/`

### Benefits

- ✅ Single source of truth prevents duplicates
- ✅ Easy asset management across environments
- ✅ Clear separation: source assets vs runtime assets
- ✅ Version control friendly (ignore auto-synced public/ files)
- ✅ Simple onboarding (npm run dev handles everything)

### Git Configuration

Add to `.gitignore`:
```
frontend/public/coin-*.svg
frontend/public/sounds/
```

Keep in repository:
```
resources/images/
resources/sounds/
```

---

## Development Guidelines

### Code Style
- **Backend**: Follow Spring Boot best practices, use Lombok
- **Frontend**: Use functional components, React hooks
- **Naming**: Camel case for variables, Pascal case for components
- **Comments**: JSDoc for functions, inline for complex logic

### Git Workflow
- Feature branches: `feature/feature-name`
- Bug fixes: `fix/bug-description`
- Commit messages: Conventional Commits format (max 20 words)
- PR required for main branch

### Docker Usage
- Development: `docker-compose up -d`
- Database only: `docker-compose up database`
- Rebuild: `docker-compose up --build`
- Stop: `docker-compose down`
- Clean volumes: `docker-compose down -v`

---

## Project Structure

```
coin-flip-webapp/
├── .github/
│   └── copilot-instructions.md
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/coinflip/
│   │   │   │       ├── controller/
│   │   │   │       ├── service/
│   │   │   │       ├── repository/
│   │   │   │       ├── model/
│   │   │   │       ├── dto/
│   │   │   │       ├── security/
│   │   │   │       ├── config/
│   │   │   │       └── CoinFlipApplication.java
│   │   │   └── resources/
│   │   │       ├── application.yml
│   │   │       └── application-dev.yml
│   │   └── test/
│   │       └── java/
│   ├── Dockerfile
│   └── pom.xml
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── CoinFlip/
│   │   │   ├── History/
│   │   │   ├── Statistics/
│   │   │   ├── Auth/
│   │   │   └── Common/
│   │   ├── pages/
│   │   │   ├── MainPage.tsx
│   │   │   ├── HistoryPage.tsx
│   │   │   ├── ProfilePage.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   └── RegisterPage.tsx
│   │   ├── services/
│   │   │   ├── api.ts
│   │   │   ├── auth.ts
│   │   │   └── storage.ts
│   │   ├── hooks/
│   │   ├── context/
│   │   ├── utils/
│   │   ├── types/
│   │   ├── assets/
│   │   │   └── sounds/
│   │   ├── tests/
│   │   │   └── e2e/
│   │   ├── App.tsx
│   │   └── index.tsx
│   ├── public/
│   ├── playwright.config.ts
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
├── resources/
│   ├── sounds/
│   │   ├── flip-start.mp3
│   │   ├── coin-rattle.mp3
│   │   └── flip-result.mp3
│   ├── images/
│   └── 3d-models/
├── docs/
│   ├── PRD.md
│   ├── STATE.md
│   └── ROADMAP.md
├── docker-compose.yml
└── README.md
```

---

## Key Documents

### README.md
- Project overview and description
- Technology stack summary
- Quick start guide (Docker Compose)
- Local development setup
- Testing instructions
- Project structure overview

### PRD.md (Product Requirements Document)
- Detailed feature specifications
- User stories and personas
- API endpoint documentation
- Database schema details
- Non-functional requirements
- Success criteria

### STATE.md (Project Status)
- Current development phase
- Completed features checklist
- In-progress tasks
- Known issues and blockers
- Recent decisions log
- Metrics dashboard

### ROADMAP.md (Future Plans)
- Release plan (v1.0 → v3.0+)
- Feature prioritization
- Timeline estimates
- Long-term vision
- Learning objectives

### ARCHITECTURE.md (System Structure)
- High-level diagrams & layering (controllers → services → repositories)
- Request lifecycle & data flow (guest session vs authenticated user)
- Cross-cutting concerns (logging, validation, config) & decision records

### API.md (Endpoint Contracts)
- Full REST endpoint catalog with request/response schemas
- Pagination, sorting, error envelope, versioning strategy
- References back to feature requirements in PRD.md

### TESTING.md (Quality Assurance Strategy)
- Backend (unit, integration, API), Frontend (unit, component, E2E) coverage goals
- Randomness distribution validation method, flaky test prevention
- Mapping of services/endpoints → test cases for traceability

### SECURITY.md (Security Posture & Threat Model)
- JWT auth lifecycle (24h expiration), password hashing (BCrypt), input validation
- OWASP Top 10 mapping (current coverage vs future mitigations)
- Secrets management & planned enhancements (rate limiting, MFA, refresh tokens)

### SERVICES.md (Service Layer Reference)
- Responsibilities & method contract summaries (AuthService, FlipService, HistoryService, StatsService, UserService)
- Exception mapping & cross-links (API.md, TESTING.md, SECURITY.md)
- Future services: AdminService, ExportService, NotificationService (WebSocket), ThemeService

### Documentation Diagrams
- **Format**: PNG images (converted from PlantUML for universal compatibility)
- **Location**: `docs/diagrams/` directory (34 diagrams total)
- **Viewing**: No plugins required - renders in any Markdown viewer
- **Regeneration**: Use `docs/generate-diagrams.ps1` to update diagrams
- **Types**: Architecture, flows, services, security, testing, database schemas, deployment
- **Benefits**: Version controlled, offline access, works in VS Code/GitHub/Azure DevOps
- **Latest**: Deployment-Architecture.png added (November 5, 2025)

### Cross-Reference Quick Map
| Area | Primary Doc | Supporting Docs |
|------|-------------|-----------------|
| Features & Acceptance | PRD.md | ROADMAP.md, STATE.md |
| Architecture & Flow | ARCHITECTURE.md | SERVICES.md, SECURITY.md |
| API Contracts | API.md | PRD.md, TESTING.md |
| Service Responsibilities | SERVICES.md | API.md, TESTING.md |
| Testing Strategy | TESTING.md | API.md, ARCHITECTURE.md |
| Security & Auth | SECURITY.md | ARCHITECTURE.md, SERVICES.md |
| Roadmap Evolution | ROADMAP.md | STATE.md |
| Progress Tracking | STATE.md | PRD.md |

Update guideline: When adding/changing an endpoint update API.md → PRD.md acceptance → SERVICES.md method list → TESTING.md cases → SECURITY.md if auth/scope impacted.

---

## Notes for Copilot

- This is a learning project - prioritize clean code and best practices
- Ask for clarification when requirements are ambiguous
- Suggest improvements and alternatives when applicable
- Focus on modular, testable code
- Document complex logic and decisions
- Use TypeScript strictly (no `any` types without justification)
- Follow RESTful API conventions
- Implement proper error handling and validation
- Consider edge cases in implementations

---

## Development Workflow Guidelines

### After Completing Any Task
**ALWAYS follow this checklist after implementing changes:**

1. **Commit Changes**
   - Stage all modified files: `git add .`
   - Write clear, concise commit message (max 20 words, Conventional Commits format)
   - Commit: `git commit -m "description"`
   - Push to remote: `git push`

2. **Update Documentation**
   - **copilot-instructions.md**: Update if new patterns, workflows, or technical decisions were made
   - **STATE.md**: Update completed features, current phase, known issues, decisions log
   - **PRD.md**: Update if feature specifications changed
   - **ARCHITECTURE.md**: Update if system structure changed
   - **API.md**: Update if endpoints were added/modified
   - **SERVICES.md**: Update if service methods changed
   - **TESTING.md**: Update if test coverage or strategy changed
   - **SECURITY.md**: Update if authentication/authorization logic changed

3. **Proactive Reminders**
   - **Before concluding any task**, explicitly ask the user:
     - "Should I commit these changes now?"
     - "Do any documentation files need updating based on these changes?"
   - **Suggest specific documentation updates** based on the nature of changes made
   - **Don't wait for user to request** - proactively offer to handle git operations and documentation

### When to Update Which Documentation

| Change Type | Primary Docs to Update | Secondary Docs |
|-------------|------------------------|----------------|
| New feature implementation | STATE.md, PRD.md | ROADMAP.md (if milestone) |
| API endpoint changes | API.md, STATE.md | SERVICES.md, TESTING.md, SECURITY.md |
| UI/UX changes | STATE.md, copilot-instructions.md | PRD.md (if spec changed) |
| Architecture changes | ARCHITECTURE.md, STATE.md | SERVICES.md, SECURITY.md |
| Service layer changes | SERVICES.md, STATE.md | API.md, TESTING.md |
| Security/auth changes | SECURITY.md, STATE.md | SERVICES.md, API.md |
| Testing strategy changes | TESTING.md, STATE.md | - |
| Bug fixes | STATE.md | Relevant feature doc |
| New workflow/pattern | copilot-instructions.md, STATE.md | - |
| Documentation only | All affected .md files | STATE.md (as note, not version) |

**Note on Documentation Updates:** When changes are purely documentation (diagrams, README, docs/*.md updates), log them in STATE.md as "Documentation Update" entries WITHOUT incrementing the version number. Example:
```markdown
### Documentation Update - November 5, 2025 (Description)
**Note:** Documentation-only changes do not increment version number per project guidelines.
- List of changes...
- Commits: commit_hashes
```

### Commit Message Format
Follow Conventional Commits:
- **feat**: New feature (`feat: Add user profile statistics dashboard`)
- **fix**: Bug fix (`fix: Correct cursor behavior on toggle component`)
- **refactor**: Code restructuring (`refactor: Simplify authentication dialog logic`)
- **style**: UI/styling changes (`style: Enhance CoinFlip component vertical sizing`)
- **docs**: Documentation only (`docs: Update API.md with new endpoints`)
- **test**: Testing changes (`test: Add integration tests for flip service`)
- **chore**: Maintenance tasks (`chore: Update dependencies`)

### Version Increment Rules

**DO increment version for:**
- ✅ New features (feat commits)
- ✅ Bug fixes (fix commits)
- ✅ Breaking changes (refactor commits that change APIs)
- ✅ UI/UX enhancements (style commits that affect user experience)
- ✅ Security updates
- ✅ Dependency updates that affect functionality

**DO NOT increment version for:**
- ❌ Documentation updates only (docs commits)
- ❌ README updates
- ❌ Code comments or inline documentation
- ❌ Diagram generation or updates
- ❌ Test additions without feature changes
- ❌ Formatting/linting fixes
- ❌ Development workflow changes
- ❌ Build script updates that don't affect output

**Version Format:** MAJOR.MINOR.PATCH
- **PATCH** (x.x.1): Bug fixes, minor improvements
- **MINOR** (x.1.0): New features, non-breaking changes
- **MAJOR** (1.0.0): Breaking changes, major milestones

### Documentation Update Checklist
When updating documentation after changes:
- [ ] Commit pushed to remote repository
- [ ] STATE.md updated with completed features and current status
- [ ] Relevant technical docs updated (API, SERVICES, ARCHITECTURE, etc.)
- [ ] copilot-instructions.md updated if new patterns/workflows introduced
- [ ] Cross-references between documents validated
- [ ] No TODO comments left in documentation without tracking

---

## Environment Variables

### Backend (.env or application-dev.yml)
```yaml
DATABASE_URL: jdbc:postgresql://localhost:5432/coinflip
DATABASE_USERNAME: admin
DATABASE_PASSWORD: secret
JWT_SECRET: your-256-bit-secret-key
JWT_EXPIRATION: 86400000  # 24 hours in milliseconds
```

### Frontend (.env.local)
```
REACT_APP_API_URL=http://localhost:8080/api
REACT_APP_WS_URL=ws://localhost:8080/ws
```