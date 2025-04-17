# Traffic Gen

An AI-powered web application for generating traffic instruction reports from various scheduling spreadsheets.

## Features

- Upload CSV, XLS, and XLSX files
- AI-powered column mapping and data normalization
- Automatic PDF report generation per station
- Modern, responsive UI with dark mode support
- Secure file storage and management

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **PDF Generation**: Puppeteer
- **AI Integration**: OpenAI API
- **Testing**: Vitest, Playwright

## Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- OpenAI API key

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/your-org/traffic-gen.git
   cd traffic-gen
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file with the following variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   OPENAI_API_KEY=your_openai_api_key
   ```

4. Set up Supabase:
   - Create a new project
   - Create the following tables:
     ```sql
     -- traffic_rows table
     create table traffic_rows (
       id uuid default uuid_generate_v4() primary key,
       campaign_id uuid not null,
       station text not null,
       platform_type text not null,
       market text not null,
       isci text not null,
       creative_title text not null,
       length_secs integer not null,
       flight_start date not null,
       flight_end date not null,
       rotations text not null,
       additional_notes text,
       created_at timestamp with time zone default timezone('utc'::text, now()) not null
     );

     -- Create storage bucket for reports
     insert into storage.buckets (id, name)
     values ('traffic-reports', 'traffic-reports');
     ```

5. Run the development server:
   ```bash
   npm run dev
   ```

## Testing

- Run unit tests:
  ```bash
  npm test
  ```

- Run end-to-end tests:
  ```bash
  npm run test:e2e
  ```

## Deployment

1. Deploy to Vercel:
   ```bash
   vercel
   ```

2. Set up environment variables in Vercel dashboard

3. Configure Supabase storage bucket permissions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT 