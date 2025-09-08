# API Integration Specifications (with Appwrite)

## 1. Notion API Integration

### Authentication
- **Type**: OAuth 2.0
- **Scopes**: `read_content`, `insert_content`, `update_content`
- **Token Storage**: Encrypted in Appwrite per user (collection: `api_connections.credentials`)

### Core Capabilities
```typescript
interface NotionActions {
  // Pages
  createPage(parentId: string, title: string, content: Block[]): Promise<Page>
  updatePage(pageId: string, properties: PageProperties): Promise<Page>
  getPage(pageId: string): Promise<Page>
  
  // Databases  
  createDatabase(parentId: string, schema: DatabaseSchema): Promise<Database>
  queryDatabase(databaseId: string, filter?: Filter): Promise<QueryResult>
  createDatabaseEntry(databaseId: string, properties: Properties): Promise<Page>
  
  // Search
  searchContent(query: string): Promise<SearchResult[]>
}
```

### Natural Language Commands
```
"Create a page called 'Meeting Notes' in my workspace"
"Add a task to my Todo database with title 'Review PR'"
"Find all pages about 'project planning'"
"Update the status of the task 'Website redesign' to 'In Progress'"
```

## 2. Google Calendar API Integration

### Authentication
- **Type**: OAuth 2.0
- **Scopes**: `https://www.googleapis.com/auth/calendar`
- **Token Refresh**: Appwrite Function scheduled refresh

### Core Capabilities
```typescript
interface CalendarActions {
  // Events
  createEvent(calendarId: string, event: CalendarEvent): Promise<Event>
  updateEvent(eventId: string, updates: Partial<CalendarEvent>): Promise<Event>
  deleteEvent(eventId: string): Promise<void>
  
  // Queries
  getEvents(calendarId: string, timeRange: TimeRange): Promise<Event[]>
  findFreeTimes(duration: number, timeRange: TimeRange): Promise<TimeSlot[]>
  
  // Calendars
  listCalendars(): Promise<Calendar[]>
  createCalendar(name: string): Promise<Calendar>
}
```

### Natural Language Commands
```
"Schedule a meeting with John tomorrow at 3pm"
"Find a free 1-hour slot next week for project review"
"Show me my calendar for today"
"Move my 2pm meeting to 4pm"
"Cancel the meeting on Friday"
```

## 3. Gmail API Integration

### Authentication
- **Type**: OAuth 2.0  
- **Scopes**: `https://www.googleapis.com/auth/gmail.modify`
- **Security**: Read/send permissions with user consent; tokens stored server-side in Appwrite

### Core Capabilities
```typescript
interface GmailActions {
  // Sending
  sendEmail(to: string[], subject: string, body: string, attachments?: File[]): Promise<Message>
  replyToEmail(messageId: string, body: string): Promise<Message>
  forwardEmail(messageId: string, to: string[], note?: string): Promise<Message>
  
  // Reading
  getMessages(query?: string, maxResults?: number): Promise<Message[]>
  getMessage(messageId: string): Promise<Message>
  searchEmails(query: string): Promise<Message[]>
  
  // Organization
  addLabel(messageId: string, labelId: string): Promise<void>
  markAsRead(messageId: string): Promise<void>
  archiveEmail(messageId: string): Promise<void>
}
```

### Natural Language Commands
```
"Send an email to john@example.com about the project update"
"Show me unread emails from last week"
"Reply to the email about budget approval with 'Approved'"
"Forward the proposal email to the team"
"Archive all emails from notifications@github.com"
```

## 4. GitHub API Integration

### Authentication
- **Type**: Personal Access Token or OAuth App
- **Permissions**: `repo`, `user`, `read:org`
- **Security**: Token encryption in Appwrite and rotation via reminders

### Core Capabilities
```typescript
interface GitHubActions {
  // Repositories
  listRepositories(): Promise<Repository[]>
  createRepository(name: string, options: RepoOptions): Promise<Repository>
  getRepository(owner: string, repo: string): Promise<Repository>
  
  // Issues
  createIssue(owner: string, repo: string, issue: IssueData): Promise<Issue>
  updateIssue(owner: string, repo: string, issueNumber: number, updates: Partial<IssueData>): Promise<Issue>
  listIssues(owner: string, repo: string, filters?: IssueFilters): Promise<Issue[]>
  
  // Pull Requests
  createPullRequest(owner: string, repo: string, pr: PRData): Promise<PullRequest>
  listPullRequests(owner: string, repo: string): Promise<PullRequest[]>
  mergePullRequest(owner: string, repo: string, prNumber: number): Promise<MergeResult>
  
  // Files and Content
  getFileContent(owner: string, repo: string, path: string): Promise<FileContent>
  createOrUpdateFile(owner: string, repo: string, path: string, content: string, message: string): Promise<void>
}
```

### Natural Language Commands
```
"Show me my open pull requests"
"Create an issue in my-project repo about the login bug"
"List all repositories I have access to"
"Get the README file from the electric-chat repository"
"Merge PR #15 in the website repo"
```

## 5. Slack API Integration

### Authentication
- **Type**: OAuth 2.0
- **Scopes**: `channels:read`, `chat:write`, `users:read`
- **Bot Token**: For workspace-level operations; store in Appwrite

### Core Capabilities
```typescript
interface SlackActions {
  // Messaging
  sendMessage(channel: string, text: string, attachments?: Attachment[]): Promise<Message>
  updateMessage(channel: string, timestamp: string, text: string): Promise<Message>
  deleteMessage(channel: string, timestamp: string): Promise<void>
  
  // Channels
  listChannels(): Promise<Channel[]>
  joinChannel(channelId: string): Promise<void>
  createChannel(name: string, isPrivate?: boolean): Promise<Channel>
  
  // Users
  getUserInfo(userId: string): Promise<User>
  listUsers(): Promise<User[]>
  
  // Files
  uploadFile(channel: string, file: File, title?: string): Promise<FileUpload>
}
```

### Natural Language Commands
```
"Send a message to #general saying 'Meeting in 5 minutes'"
"Upload the project plan to #project-team channel"
"Show me recent messages from @john"
"Create a private channel for the design team"
"List all channels I'm a member of"
```

## 6. Weather API Integration

### Service Provider
- **Primary**: OpenWeatherMap API
- **Backup**: WeatherAPI.com
- **Authentication**: API Key

### Core Capabilities
```typescript
interface WeatherActions {
  getCurrentWeather(location: string): Promise<WeatherData>
  getForecast(location: string, days: number): Promise<ForecastData>
  getWeatherAlerts(location: string): Promise<WeatherAlert[]>
  searchLocations(query: string): Promise<Location[]>
}
```

### Natural Language Commands
```
"What's the weather like in New York?"
"Will it rain tomorrow in San Francisco?"
"Show me the 5-day forecast for London"
"Are there any weather alerts for Miami?"
```

## 7. Linear/Task Management APIs

### Authentication
- **Linear**: API Key or OAuth
- **Trello**: OAuth 2.0
- **Asana**: OAuth 2.0

### Core Capabilities
```typescript
interface TaskActions {
  // Tasks
  createTask(title: string, description?: string, assignee?: string): Promise<Task>
  updateTask(taskId: string, updates: Partial<Task>): Promise<Task>
  listTasks(filters?: TaskFilters): Promise<Task[]>
  
  // Projects
  listProjects(): Promise<Project[]>
  createProject(name: string, description?: string): Promise<Project>
  
  // Teams
  listTeamMembers(): Promise<User[]>
  assignTask(taskId: string, userId: string): Promise<void>
}
```

## Common Integration Patterns

### Error Handling
```typescript
interface APIResponse<T> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    retryable: boolean
  }
}
```

### Rate Limiting
- Implement exponential backoff for rate limits
- Queue requests during high usage
- Show user-friendly messages for delays
- Cache frequently accessed data

### Token Management
- Automatic refresh for OAuth tokens
- Encrypted storage in Appwrite database
- Fallback authentication prompts
- Regular token validity checks

### Action Validation
```typescript
interface ActionValidator {
  validateParams(action: string, params: any): ValidationResult
  checkPermissions(userId: string, action: string): boolean
  sanitizeInput(input: any): any
}
```

This comprehensive API integration plan ensures your multi-API AI assistant can effectively interact with all major productivity and development tools while maintaining security and reliability.
