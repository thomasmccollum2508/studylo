@echo off
cd /d "%~dp0"
echo Staging all changes...
git add -A
echo.
echo Committing changes...
git commit -m "Fix: Upgrade to Next.js 16, fix Supabase error handling, fix runtime errors

- Upgrade Next.js from 15.1.0 to 16.1.6
- Upgrade ESLint to 9.0.0 for Next.js 16 compatibility
- Add @eslint/eslintrc for ESLint 9 flat config support
- Update eslint.config.mjs for ESLint 9 compatibility
- Fix Supabase server/client to return null instead of throwing when env vars missing
- Add error handling in middleware and API routes
- Fix settings page: add useTheme hook for theme variable
- Fix global-error: make reset optional with fallback
- Add dev.bat and install.bat for Windows PowerShell compatibility
- Switch dev server to use Webpack instead of Turbopack
- Add global error boundary component"
echo.
echo Done! Changes committed.
pause
