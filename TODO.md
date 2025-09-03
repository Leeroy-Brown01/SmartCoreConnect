# TODO: Fix Problems in README.md

## Completed Tasks
- [x] Update project title from "SmartCoreConnect" to "Review Stream Hub"
- [x] Fix installation cd command from "cd smartcoreconnect" to "cd review-stream-hub"
- [x] Update project structure to include supabase/ directory
- [x] Update package.json name from "vite_react_shadcn_ts" to "review-stream-hub"
- [x] Update .env setup instructions to mention it may already exist
- [x] Implement CLI prompt for manual Supabase installation selection during npm run dev

## Summary of Changes
- README.md: Updated title, cd command, project structure, and .env instructions
- package.json: Updated project name to match directory and README
- scripts/select-supabase.js: Created CLI script to prompt for Supabase URL and anon key
- package.json: Modified dev script to run the prompt before starting backend and frontend
- src/integrations/supabase/client.ts: Updated to read Supabase credentials from environment variables
