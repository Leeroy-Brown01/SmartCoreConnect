import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function main() {
  console.log('=== Supabase Installation Selection ===');
  console.log('Please provide your Supabase installation details:');

  const supabaseUrl = await askQuestion('Enter Supabase URL (e.g., https://your-project.supabase.co): ');
  const supabaseAnonKey = await askQuestion('Enter Supabase Anon Key: ');

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Both URL and Anon Key are required.');
    rl.close();
    process.exit(1);
  }

  // Path to .env file in the project root
  const envPath = path.join(__dirname, '..', '.env');

  // Read existing .env file if it exists
  let envContent = '';
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
  }

  // Update or add the Supabase variables
  const lines = envContent.split('\n');
  const updatedLines = lines.map(line => {
    if (line.startsWith('VITE_SUPABASE_URL=')) {
      return `VITE_SUPABASE_URL=${supabaseUrl}`;
    }
    if (line.startsWith('VITE_SUPABASE_ANON_KEY=')) {
      return `VITE_SUPABASE_ANON_KEY=${supabaseAnonKey}`;
    }
    return line;
  });

  // Add if not present
  if (!updatedLines.some(line => line.startsWith('VITE_SUPABASE_URL='))) {
    updatedLines.push(`VITE_SUPABASE_URL=${supabaseUrl}`);
  }
  if (!updatedLines.some(line => line.startsWith('VITE_SUPABASE_ANON_KEY='))) {
    updatedLines.push(`VITE_SUPABASE_ANON_KEY=${supabaseAnonKey}`);
  }

  // Write back to .env
  fs.writeFileSync(envPath, updatedLines.join('\n'), 'utf8');

  console.log('Supabase configuration updated in .env file.');
  console.log(`URL: ${supabaseUrl}`);
  console.log('Starting development server...');

  rl.close();
}

main().catch(console.error);
