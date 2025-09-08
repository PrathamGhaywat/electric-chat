# Environment Configuration

## Required API Keys and Services

### 1. OpenRouter (Primary AI Provider)
```env
OPENROUTER_API_KEY=your_openrouter_api_key
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
```

### 2. Database (PostgreSQL)
```env
DATABASE_URL="postgresql://username:password@localhost:5432/electric_chat"
```

### 3. NextAuth Configuration
```env
NEXTAUTH_SECRET=your_nextauth_secret_key
NEXTAUTH_URL=http://localhost:3000
```

### 4. API Integrations

#### Notion API
```env
NOTION_CLIENT_ID=your_notion_client_id
NOTION_CLIENT_SECRET=your_notion_client_secret
NOTION_REDIRECT_URI=http://localhost:3000/api/auth/callback/notion
```

#### Google APIs (Calendar, Gmail, Drive)
```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

#### GitHub API
```env
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

#### Slack API
```env
SLACK_CLIENT_ID=your_slack_client_id
SLACK_CLIENT_SECRET=your_slack_client_secret
```

### 5. Optional Services

#### File Upload (AWS S3 or Cloudinary)
```env
# AWS S3
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your_s3_bucket

# Or Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

#### Redis (for caching and sessions)
```env
REDIS_URL=redis://localhost:6379
```

## Setup Instructions

### 1. Create `.env.local` file
```bash
cp .env.example .env.local
# Edit .env.local with your actual API keys
```

### 2. Database Setup
```bash
# Install PostgreSQL locally or use cloud provider
# Update DATABASE_URL in .env.local
npx prisma migrate dev
npx prisma generate
```

### 3. OAuth Application Setup

#### Google Cloud Console
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project or select existing
3. Enable APIs: Calendar, Gmail, Drive, People
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://yourdomain.com/api/auth/callback/google`

#### Notion Integration
1. Go to [Notion Developers](https://www.notion.so/my-integrations)
2. Create new integration
3. Configure OAuth settings
4. Add redirect URI: `http://localhost:3000/api/auth/callback/notion`

#### GitHub OAuth App
1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Create new OAuth App
3. Set Authorization callback URL: `http://localhost:3000/api/auth/callback/github`

### 4. OpenRouter Setup
1. Sign up at [OpenRouter](https://openrouter.ai/)
2. Get API key from dashboard
3. Add credits to your account
4. Select models you want to use (GPT-4, Claude, etc.)

## Development vs Production

### Development Environment
```env
NODE_ENV=development
NEXTAUTH_URL=http://localhost:3000
DATABASE_URL="postgresql://localhost:5432/electric_chat_dev"
```

### Production Environment
```env
NODE_ENV=production
NEXTAUTH_URL=https://yourdomain.com
DATABASE_URL="postgresql://prod_url"
```

## Security Considerations

### Environment Variables
- Never commit `.env.local` to version control
- Use different keys for development and production
- Rotate API keys regularly
- Use strong, unique secrets for NextAuth

### API Key Permissions
- Grant minimal required permissions for each API
- Regularly audit connected applications
- Implement token refresh mechanisms
- Store tokens encrypted in database
