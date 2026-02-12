@echo off
REM 🚀 BUDDY'S TREEHOUSE V5 - AUTOMATED DEPLOYMENT SCRIPT (Windows)
REM Run this script to automatically deploy to GitHub

echo 🌳 Buddy's Treehouse V5 - Deployment Script
echo ============================================
echo.

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Error: package.json not found
    echo Please run this script from the buddys-treehouse-v5 directory
    pause
    exit /b 1
)

echo 📦 Step 1: Installing dependencies...
call npm install
if errorlevel 1 (
    echo ❌ npm install failed
    pause
    exit /b 1
)
echo ✅ Dependencies installed
echo.

echo 🧪 Step 2: Testing build...
call npm run build
if errorlevel 1 (
    echo ❌ Build failed - please fix errors before deploying
    pause
    exit /b 1
)
echo ✅ Build successful
echo.

echo 🎯 Step 3: Initializing Git...
if not exist ".git" (
    git init
    echo ✅ Git initialized
) else (
    echo ✅ Git already initialized
)
echo.

echo 📝 Step 4: Staging files...
git add .
echo ✅ Files staged
echo.

echo 💾 Step 5: Creating commit...
git commit -m "🚀 Initial commit - Buddy's Treehouse V5"
echo ✅ Commit created
echo.

echo 🔗 Step 6: Setting up GitHub remote...
echo.
echo Please enter your GitHub repository URL
echo Example: https://github.com/username/buddys-treehouse-v5.git
echo.
set /p REPO_URL="GitHub repo URL: "

if "%REPO_URL%"=="" (
    echo ❌ No URL provided
    pause
    exit /b 1
)

REM Check if remote already exists
git remote | findstr "origin" >nul
if not errorlevel 1 (
    echo Remote 'origin' already exists. Removing...
    git remote remove origin
)

git remote add origin %REPO_URL%
echo ✅ Remote added
echo.

echo 🚀 Step 7: Pushing to GitHub...
git branch -M main
git push -u origin main

if errorlevel 1 (
    echo ❌ Push failed
    echo This might be because:
    echo   - The repository doesn't exist on GitHub yet
    echo   - You need to authenticate
    echo   - There's a conflict
    echo.
    echo Please:
    echo   1. Create the repository on GitHub: https://github.com/new
    echo   2. Run: git push -u origin main
    pause
    exit /b 1
)

echo ✅ Successfully pushed to GitHub!
echo.
echo ============================================
echo 🎉 DEPLOYMENT COMPLETE!
echo ============================================
echo.
echo Your code is now on GitHub!
echo.
echo Next steps:
echo 1. Go to https://vercel.com
echo 2. Sign in with GitHub
echo 3. Click 'Add New Project'
echo 4. Select your repository: buddys-treehouse-v5
echo 5. Click 'Deploy'
echo.
echo Your app will be live in ~2-3 minutes! 🚀
echo.
pause
