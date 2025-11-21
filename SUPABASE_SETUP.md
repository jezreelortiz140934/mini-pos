# Supabase Setup Instructions

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in to your account
3. Click "New Project"
4. Fill in the project details:
   - Project name: `mini-pos` (or your preferred name)
   - Database password: Create a strong password
   - Region: Choose the closest region to you
5. Click "Create new project" and wait for the setup to complete

## Step 2: Get Your API Credentials

1. Once your project is ready, go to **Settings** (gear icon in the left sidebar)
2. Click on **API** in the settings menu
3. Copy the following values:
   - **Project URL** (under "Project URL")
   - **anon public** key (under "Project API keys")

## Step 3: Configure Your Environment Variables

1. Open the `.env` file in your project root
2. Replace the placeholder values with your actual credentials:
   ```
   REACT_APP_SUPABASE_URL=https://your-project-id.supabase.co
   REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here
   ```

## Step 4: Create Database Tables

1. In your Supabase dashboard, go to **SQL Editor** (in the left sidebar)
2. Click "New Query"
3. Open the `supabase-schema.sql` file in your project
4. Copy all the SQL code from that file
5. Paste it into the SQL Editor in Supabase
6. Click "Run" to execute the SQL and create all tables

## Step 5: Verify Tables Creation

1. Go to **Table Editor** (in the left sidebar)
2. You should see the following tables:
   - `stylists`
   - `products`
   - `services`
   - `walk_in_appointments`
   - `sales`
   - `orders`

## Step 6: Restart Your Development Server

After setting up the environment variables:

```bash
npm start
```

## Database Schema Overview

### Tables Created:

1. **stylists** - Store stylist information (name, contact number)
2. **products** - Store product inventory (name, price, stock)
3. **services** - Store available services (title, description, price, image)
4. **walk_in_appointments** - Store walk-in client appointments
5. **sales** - Store completed transactions
6. **orders** - Store POS cart orders with items

### Security:

- Row Level Security (RLS) is enabled on all tables
- Currently configured for public access (good for testing)
- **Important**: Update the security policies before production deployment

## Next Steps

After completing the setup:

1. Test the connection by adding a stylist or product
2. Check the Supabase Table Editor to verify data is being saved
3. Monitor the Database logs for any errors

## Troubleshooting

- **Connection errors**: Verify your `.env` file has the correct credentials
- **Table not found**: Make sure you ran the SQL schema in Step 4
- **Permission denied**: Check that RLS policies are created correctly

## Production Considerations

Before deploying to production:

1. Update RLS policies to implement proper authentication
2. Add user authentication with Supabase Auth
3. Restrict API key usage
4. Set up proper backup and monitoring
