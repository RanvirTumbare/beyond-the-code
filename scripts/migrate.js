import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const databaseUrl = process.env.DATABASE_URL || process.argv[2];

if (!databaseUrl) {
  console.error('\n❌ ERROR: No DATABASE_URL provided.');
  console.log('\nUsage:');
  console.log('  1. Add DATABASE_URL to your .env file:');
  console.log('     DATABASE_URL=postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres');
  console.log('  2. Or run: node scripts/migrate.js "postgresql://..."\n');
  process.exit(1);
}

const migrationPath = path.resolve(__dirname, '../supabase/migrations/20250101000000_beyond_the_code_schema.sql');

if (!fs.existsSync(migrationPath)) {
  console.error(`\n❌ Migration file not found at: ${migrationPath}`);
  process.exit(1);
}

const sql = fs.readFileSync(migrationPath, 'utf8');

async function runMigration() {
  console.log('\n🔄 Connecting to Supabase PostgreSQL database...');
  const client = new pg.Client({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    console.log('✅ Connected successfully!');

    console.log('🔄 Executing schema migration, RLS policies, triggers, and seed data...');
    await client.query(sql);

    console.log('\n🎉 SUCCESS! Database schema and seed data created successfully.');
    console.log('Created Tables:');
    console.log('  - site_settings');
    console.log('  - home_content');
    console.log('  - explore_cards');
    console.log('  - about_content');
    console.log('  - skills');
    console.log('  - journey_events');
    console.log('  - projects');
    console.log('  - certificates');
    console.log('  - diary_posts');
    console.log('  - gallery_items');
    console.log('  - contact_messages');
    console.log('  - admin_users');
    console.log('Storage:');
    console.log('  - media bucket (public read, admin write)');

    // Optional admin user insert if user id or email passed
    const adminUserId = process.env.ADMIN_USER_ID || process.argv[3];
    if (adminUserId) {
      console.log(`\n🔄 Granting admin privileges to User ID: ${adminUserId}...`);
      await client.query(
        'INSERT INTO public.admin_users (user_id) VALUES ($1) ON CONFLICT DO NOTHING;',
        [adminUserId]
      );
      console.log('✅ Admin user registered in admin_users table!');
    }
  } catch (err) {
    console.error('\n❌ Migration failed:', err.message);
  } finally {
    await client.end();
  }
}

runMigration();

