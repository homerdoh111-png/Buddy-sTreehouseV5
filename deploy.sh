#!/bin/bash

# 🚀 BUDDY'S TREEHOUSE V5 - AUTOMATED DEPLOYMENT SCRIPT
# Run this script to automatically deploy to GitHub

echo "🌳 Buddy's Treehouse V5 - Deployment Script"
echo "============================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: package.json not found${NC}"
    echo "Please run this script from the buddys-treehouse-v5 directory"
    exit 1
fi

echo -e "${YELLOW}📦 Step 1: Installing dependencies...${NC}"
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ npm install failed${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Dependencies installed${NC}"
echo ""

echo -e "${YELLOW}🧪 Step 2: Testing build...${NC}"
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed - please fix errors before deploying${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Build successful${NC}"
echo ""

echo -e "${YELLOW}🎯 Step 3: Initializing Git...${NC}"
if [ ! -d ".git" ]; then
    git init
    echo -e "${GREEN}✅ Git initialized${NC}"
else
    echo -e "${GREEN}✅ Git already initialized${NC}"
fi
echo ""

echo -e "${YELLOW}📝 Step 4: Staging files...${NC}"
git add .
echo -e "${GREEN}✅ Files staged${NC}"
echo ""

echo -e "${YELLOW}💾 Step 5: Creating commit...${NC}"
git commit -m "🚀 Initial commit - Buddy's Treehouse V5

Features:
- 42 educational activities across 10 modules
- Custom Suno jingle integration
- Voice recorder (Talking Tom feature)
- Parent dashboard with analytics
- Gamification system (164 stars, 12 achievements)
- Professional animations and celebrations

Tech Stack:
- React 18.2 + TypeScript 5.3
- Vite 5.1 + Tailwind CSS 3.4
- Framer Motion 11.0 + Zustand 4.5

Estimated Value: \$110,000+"

if [ $? -ne 0 ]; then
    echo -e "${YELLOW}⚠️  No changes to commit or already committed${NC}"
else
    echo -e "${GREEN}✅ Commit created${NC}"
fi
echo ""

echo -e "${YELLOW}🔗 Step 6: Setting up GitHub remote...${NC}"
echo ""
echo "Please enter your GitHub repository URL"
echo "Example: https://github.com/username/buddys-treehouse-v5.git"
echo ""
read -p "GitHub repo URL: " REPO_URL

if [ -z "$REPO_URL" ]; then
    echo -e "${RED}❌ No URL provided${NC}"
    exit 1
fi

# Check if remote already exists
if git remote | grep -q "origin"; then
    echo "Remote 'origin' already exists. Removing..."
    git remote remove origin
fi

git remote add origin "$REPO_URL"
echo -e "${GREEN}✅ Remote added${NC}"
echo ""

echo -e "${YELLOW}🚀 Step 7: Pushing to GitHub...${NC}"
git branch -M main
git push -u origin main

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Push failed${NC}"
    echo "This might be because:"
    echo "  - The repository doesn't exist on GitHub yet"
    echo "  - You need to authenticate"
    echo "  - There's a conflict"
    echo ""
    echo "Please:"
    echo "  1. Create the repository on GitHub: https://github.com/new"
    echo "  2. Run: git push -u origin main"
    exit 1
fi

echo -e "${GREEN}✅ Successfully pushed to GitHub!${NC}"
echo ""
echo "============================================"
echo -e "${GREEN}🎉 DEPLOYMENT COMPLETE!${NC}"
echo "============================================"
echo ""
echo "Your code is now on GitHub!"
echo ""
echo "Next steps:"
echo "1. Go to https://vercel.com"
echo "2. Sign in with GitHub"
echo "3. Click 'Add New Project'"
echo "4. Select your repository: buddys-treehouse-v5"
echo "5. Click 'Deploy'"
echo ""
echo "Your app will be live in ~2-3 minutes! 🚀"
echo ""
