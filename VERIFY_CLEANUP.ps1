# Quick Test Script for My Task Manager
# Run this to verify everything works after cleanup

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "   MY TASK MANAGER - VERIFICATION TEST" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Green

$ErrorActionPreference = "Stop"
$projectRoot = "c:\Users\kipattab.FAREAST\Downloads\crossskill-demo\task-manager-starter"

# Test 1: Check critical files exist
Write-Host "Test 1: Checking file structure..." -ForegroundColor Cyan
$criticalFiles = @(
    "$projectRoot\README.md",
    "$projectRoot\SETUP.md",
    "$projectRoot\GIT_SETUP.md",
    "$projectRoot\.gitignore",
    "$projectRoot\backend\.gitignore",
    "$projectRoot\backend\app\main.py",
    "$projectRoot\backend\auth.py",
    "$projectRoot\backend\requirements.txt",
    "$projectRoot\frontend\.gitignore",
    "$projectRoot\frontend\package.json",
    "$projectRoot\frontend\src\app\app.component.ts"
)

$allExist = $true
foreach ($file in $criticalFiles) {
    if (Test-Path $file) {
        Write-Host "  ✅ $(Split-Path $file -Leaf)" -ForegroundColor Green
    } else {
        Write-Host "  ❌ MISSING: $file" -ForegroundColor Red
        $allExist = $false
    }
}

if (-not $allExist) {
    Write-Host "`n⚠️  Some critical files are missing!" -ForegroundColor Red
    exit 1
}

# Test 2: Check no duplicates in backend root
Write-Host "`nTest 2: Verifying no duplicate files in backend root..." -ForegroundColor Cyan
$shouldNotExist = @(
    "$projectRoot\backend\main.py",
    "$projectRoot\backend\crud.py",
    "$projectRoot\backend\database.py",
    "$projectRoot\backend\models.py",
    "$projectRoot\backend\schemas.py"
)

$noDuplicates = $true
foreach ($file in $shouldNotExist) {
    if (Test-Path $file) {
        Write-Host "  ❌ DUPLICATE FOUND: $(Split-Path $file -Leaf)" -ForegroundColor Red
        $noDuplicates = $false
    } else {
        Write-Host "  ✅ No duplicate: $(Split-Path $file -Leaf)" -ForegroundColor Green
    }
}

if (-not $noDuplicates) {
    Write-Host "`n⚠️  Duplicate files found! These should be only in backend/app/" -ForegroundColor Red
}

# Test 3: Check backend/app structure
Write-Host "`nTest 3: Checking backend/app structure..." -ForegroundColor Cyan
$appFiles = @("__init__.py", "main.py", "database.py", "models.py", "schemas.py", "crud.py")
$appPath = "$projectRoot\backend\app"
$allAppFilesExist = $true

foreach ($file in $appFiles) {
    if (Test-Path "$appPath\$file") {
        Write-Host "  ✅ $file" -ForegroundColor Green
    } else {
        Write-Host "  ❌ MISSING: $file" -ForegroundColor Red
        $allAppFilesExist = $false
    }
}

# Test 4: Check instructor backup
Write-Host "`nTest 4: Verifying instructor backup..." -ForegroundColor Cyan
$backupPath = "c:\Users\kipattab.FAREAST\Downloads\crossskill-demo\instructor-backup"
if (Test-Path $backupPath) {
    Write-Host "  ✅ Backup folder exists" -ForegroundColor Green
    $backupFiles = Get-ChildItem $backupPath -Recurse -File | Measure-Object
    Write-Host "  ✅ $($backupFiles.Count) files backed up" -ForegroundColor Green
} else {
    Write-Host "  ⚠️  Backup folder not found" -ForegroundColor Yellow
}

# Test 5: Check .gitignore files
Write-Host "`nTest 5: Checking .gitignore files..." -ForegroundColor Cyan
$gitignoreFiles = @(
    "$projectRoot\.gitignore",
    "$projectRoot\backend\.gitignore",
    "$projectRoot\frontend\.gitignore"
)

foreach ($file in $gitignoreFiles) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        if ($content.Length -gt 50) {
            Write-Host "  ✅ $(Split-Path $file -Leaf) ($(([math]::Round($content.Length / 1024, 2))) KB)" -ForegroundColor Green
        } else {
            Write-Host "  ⚠️  $(Split-Path $file -Leaf) seems empty" -ForegroundColor Yellow
        }
    }
}

# Test 6: Verify app title in frontend
Write-Host "`nTest 6: Checking frontend app title..." -ForegroundColor Cyan
$appComponentPath = "$projectRoot\frontend\src\app\app.component.ts"
$content = Get-Content $appComponentPath -Raw
if ($content -match "title\s*=\s*['`"]My Task Manager['`"]") {
    Write-Host "  ✅ App title is 'My Task Manager'" -ForegroundColor Green
} else {
    Write-Host "  ⚠️  App title might not be updated" -ForegroundColor Yellow
}

# Summary
Write-Host "`n========================================" -ForegroundColor Green
Write-Host "           VERIFICATION SUMMARY" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

if ($allExist -and $noDuplicates -and $allAppFilesExist) {
    Write-Host "`n✅ All checks passed!" -ForegroundColor Green
    Write-Host "`nRepository is clean and ready for:" -ForegroundColor Cyan
    Write-Host "  1. git init" -ForegroundColor White
    Write-Host "  2. git add ." -ForegroundColor White
    Write-Host "  3. git commit -m 'Initial commit'" -ForegroundColor White
    Write-Host "  4. git push" -ForegroundColor White
    Write-Host "`nSee GIT_SETUP.md for complete instructions.`n" -ForegroundColor Cyan
} else {
    Write-Host "`n⚠️  Some issues found. Please review above.`n" -ForegroundColor Yellow
}

Write-Host "Next step: Test the application manually:" -ForegroundColor Cyan
Write-Host "  Terminal 1: cd backend; .\.venv\Scripts\Activate.ps1; uvicorn app.main:app --reload --port 8000" -ForegroundColor White
Write-Host "  Terminal 2: cd frontend; npm start" -ForegroundColor White
Write-Host "  Browser: http://localhost:4200`n" -ForegroundColor White
