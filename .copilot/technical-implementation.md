# Technical Implementation Plan

## Architecture Overview

### 1. Core Stack
```
Frontend: Next.js 15 (App Router)
AI Provider: OpenRouter API
Backend Platform: Appwrite (Auth, Database, Storage, Realtime, Functions)
Auth: Appwrite Auth (OAuth via providers)
DB: Appwrite Databases & Collections
Realtime: Appwrite Channels (chat, actions)
Deployment: Vercel (web) + Appwrite Cloud/self-hosted
```

### 2. System Architecture

```
┌──────────────────┐    ┌─────────────────────┐    ┌─────────────────┐
│   Chat UI        │    │   AI Orchestrator   │    │  External APIs  │
│   (Next.js)      │◄──►│   (OpenRouter +     │◄──►│ (Notion, Google │
└──────────────────┘    │    Appwrite Fn)     │    │  GitHub, etc.)  │
                        └─────────┬───────────┘    └─────────────────┘
                                  │
                                  ▼
                        ┌─────────────────────┐
                        │ Appwrite Platform   │
                        │ Auth | DB | Storage │
                        │ Realtime | Functions│
                        └─────────────────────┘
```

### 3. Core Components

#### AI Orchestrator (`/lib/ai/orchestrator.ts`)
```typescript
class AIOrchestrator {
  - analyzeIntent(message: string)
  - routeToApis(intent: Intent)
  - executeActions(actions: Action[])
  - formatResponse(results: ApiResult[])
}
```

#### API Manager (`/lib/apis/manager.ts`)
```typescript
interface ApiConnector {
  authenticate(): Promise<void>
  execute(action: Action): Promise<Result>
  validate(params: any): boolean
}
```

#### Context Manager (`/lib/context/manager.ts`)
```typescript
class ContextManager {
  - storeConversation(userId: string, messages: Message[])
  - getRelevantContext(userId: string, query: string)
  - updateUserPreferences(userId: string, preferences: Preferences)
}
```

#### Agents Manager (`/lib/agents/manager.ts`)
```typescript
interface AgentConfig {
  id: string
  name: string
  description?: string
  systemPrompt: string
  tools: string[] // e.g., ['notion','calendar','github']
  memory: {
    enabled: boolean
    strategy: 'summary' | 'vector' | 'none'
  }
  model: string // openrouter model id
  temperature?: number
}

class AgentsManager {
  - createAgent(userId: string, config: AgentConfig)
  - updateAgent(agentId: string, updates: Partial<AgentConfig>)
  - listAgents(userId: string)
  - runAgent(agentId: string, input: Message)
}
```

## 4. Database Schema (Appwrite Collections)

### Tables
```text
Database: electric_chat

Collections:
- users: { userId, email, name, avatar, createdAt }
- conversations: { userId, title, agentId?, createdAt }
- messages: { conversationId, role, content, metadata, createdAt }
- api_connections: { userId, provider, credentials (encrypted), status, scopes }
- api_actions: { userId, provider, actionType, parameters, result, status, error }
- user_preferences: { userId, preferences }
- agents: { userId, name, description, systemPrompt, tools[], memory, model, temperature }
- files: managed by Appwrite Storage (uploads, transcripts, etc.)
```

## 5. API Integration Strategy

### Phase 1: Core APIs
- **Notion**: Pages, databases, blocks CRUD
- **Google Calendar**: Event management
- **Gmail**: Email operations
- **GitHub**: Repository operations

### Phase 2: Extended APIs
- **Slack**: Messaging and channels
- **Trello/Linear**: Task management
- **Google Drive**: File operations
- **Weather APIs**: Real-time data

### Phase 3: Advanced Features
- **File processing**: PDF, images, documents
- **Web scraping**: Dynamic content fetching
- **Custom webhooks**: User-defined integrations

## 6. Security & Authentication

### OAuth Flow (via Appwrite Auth)
```
1. User connects service → OAuth redirect
2. Store encrypted tokens → Database
3. Token refresh → Background job
4. API calls → Use stored tokens
```

### Security Measures
- Encrypted token storage
- Rate limiting per user/API
- Request validation and sanitization
- API key rotation
- Audit logging

Token handling note: Store third-party OAuth tokens in `api_connections.credentials` encrypted using Appwrite's built-in encryption and only access via server-side functions/routes.

## 7. Development Phases

### Phase 1: Foundation (Weeks 1-2)
- [ ] Basic chat UI
- [ ] OpenRouter integration
- [ ] Appwrite setup (project, database, auth providers, storage)
- [ ] Appwrite SDK wiring in Next.js (server and client)
- [ ] Realtime channels for chat

### Phase 2: Core APIs (Weeks 3-4)
- [ ] Notion API integration
- [ ] Google Calendar integration
- [ ] Basic action execution
- [ ] Agents CRUD in Appwrite

### Phase 3: Enhanced Experience (Weeks 5-6)
- [ ] Context management
- [ ] Real-time updates
- [ ] Error handling and retries
- [ ] Agent memory strategies (summary/vector)

### Phase 4: Polish & Deploy (Weeks 7-8)
- [ ] UI/UX improvements
- [ ] Performance optimization
- [ ] Testing and deployment
- [ ] Appwrite Functions for scheduled tasks (token refresh, sync)
