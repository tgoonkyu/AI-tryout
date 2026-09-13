# 📊 Project Status Scripts

This directory contains PowerShell scripts for monitoring and updating project status.

---

## 📁 Scripts

### 1. get-status.ps1
**Purpose:** Extract and display JSON status from STATE.md

**Usage:**
```powershell
# Display status in console
.\get-status.ps1

# Export to JSON file
.\get-status.ps1 -Export -OutputPath "status.json"
```

**Output:**
- Current phase and progress
- Phase-by-phase breakdown
- Metrics (commits, features, coverage)
- Next milestone information

---

### 2. update-status.ps1
**Purpose:** Update specific fields in the JSON status

**Usage:**
```powershell
# Update Phase 1 progress to 50%
.\update-status.ps1 -Phase 1 -Progress 50

# Mark Phase 0 as completed
.\update-status.ps1 -Phase 0 -Status completed -Progress 100

# Update overall progress
.\update-status.ps1 -OverallProgress 25

# Update multiple values
.\update-status.ps1 -Phase 1 -Progress 75 -Status in_progress -OverallProgress 20

# Show help
.\update-status.ps1 -ShowHelp
```

**Parameters:**
- `-Phase <0-5>` - Phase number to update
- `-Progress <0-100>` - Progress percentage
- `-Status <string>` - Phase status: not_started, in_progress, completed
- `-OverallProgress <0-100>` - Overall project progress

---

## 🚨 Script Execution Policy

If you get an error about execution policies, run:

```powershell
# Option 1: Allow for current session only (safest)
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass

# Option 2: Allow for current user (recommended)
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned

# Then run the script
.\get-status.ps1
```

---

## 🔄 Alternative: Direct Execution

If you can't change execution policy, run scripts directly:

```powershell
# Get status
powershell -ExecutionPolicy Bypass -File .\get-status.ps1

# Update status
powershell -ExecutionPolicy Bypass -File .\update-status.ps1 -Phase 1 -Progress 50
```

---

## 📊 JSON Status Format

The scripts work with the JSON block in `docs/STATE.md`:

```json
{
  "project": {
    "name": "Coin Flip Application",
    "version": "0.7.0",
    "lastUpdated": "2025-11-04"
  },
  "status": {
    "currentPhase": "MVP Final Sprint",
    "overallProgress": 90,
    "backendProgress": 85,
    "frontendProgress": 90,
    "integrationProgress": 75,
    "testingProgress": 0,
    "docsProgress": 90
  },
  "metrics": {
    "commits": 0,
    "featuresImplemented": 0,
    "openIssues": 0,
    "coverageBackend": 0,
    "coverageFrontend": 0
  },
  "milestones": {
    "mvpTargetDate": "2025-11-06",
    "nextRelease": "2025-12-15"
  }
}
```

---

## 🎯 Use Cases

### Daily Standup
```powershell
# Quick status check
.\get-status.ps1
```

### After Completing a Task
```powershell
# Update phase progress
.\update-status.ps1 -Phase 1 -Progress 30
```

### Phase Completion
```powershell
# Mark phase as completed and update overall
.\update-status.ps1 -Phase 0 -Status completed -Progress 100 -OverallProgress 10
```

### Export for Dashboard
```powershell
# Export JSON for external monitoring tools
.\get-status.ps1 -Export -OutputPath "../status-export.json"
```

---

## 🔧 Integration

These scripts can be integrated with:

- **CI/CD Pipelines:** Auto-update progress after successful builds
- **Azure DevOps Dashboards:** Export JSON for visualization
- **Team Notifications:** Trigger alerts on milestone completion
- **Project Management Tools:** Sync status with tracking systems

### Example: Azure Pipeline Integration

```yaml
# azure-pipelines.yml
steps:
  - task: PowerShell@2
    inputs:
      filePath: 'scripts/update-status.ps1'
      arguments: '-Phase 1 -Progress 50'
```

---

## 📝 Best Practices

1. **Update after significant progress:** Don't update for every tiny change
2. **Keep timestamps current:** Scripts auto-update lastUpdated
3. **Commit changes:** After updating, commit the STATE.md changes
4. **Team coordination:** Avoid concurrent updates to prevent conflicts

---

## 🆘 Troubleshooting

**Problem:** Script not found
```powershell
# Ensure you're in the scripts directory
cd "d:\Projects\AI Training - 4-11-2025\coin-flip-webapp\scripts"
```

**Problem:** Execution policy error
```powershell
# Run with bypass
powershell -ExecutionPolicy Bypass -File .\get-status.ps1
```

**Problem:** JSON parsing error
- Check that STATE.md has valid JSON between \`\`\`json and \`\`\`
- Use a JSON validator to check syntax

---

## 📚 Related Files

- **STATE.md:** Main project status document (../docs/STATE.md)
- **PRD.md:** Product requirements (../docs/PRD.md)
- **ROADMAP.md:** Future plans (../docs/ROADMAP.md)

---

**Last Updated:** November 5, 2025 (Synced v1.0.1)

### Future Enhancements
- Add parsing for new progress fields (backendProgress, frontendProgress, etc.).
- Introduce optional `-AutoCommit` flag to stage & commit STATE.md changes.
- Validate JSON block presence; emit warning if missing.
- Support output formatting (`-Format table|json`).

### Future Script Ideas
| Script | Purpose |
|--------|---------|
| generate-release-notes.ps1 | Summarize changes between versions |
| validate-docs.ps1 | Check required sections across markdown docs |
| sync-version.ps1 | Propagate version bump to all docs |
| test-report-merge.ps1 | Combine FE/BE coverage into unified JSON |
