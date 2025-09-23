# VimMotion Trainer - Product Requirements Document

## Product Overview

VimMotion Trainer is a web application designed to help developers master Vim motions through interactive practice problems. The app dynamically generates code transformation challenges where users must navigate from a current state to a target state using optimal Vim commands.

## Core Value Proposition

- **Infinite Practice**: Dynamically generated problems ensure users never run out of content
- **Progressive Learning**: Difficulty scaling from basic motions to complex combinations
- **Real Code Context**: Practice with actual code patterns, not abstract text
- **Performance Tracking**: Detailed analytics on motion efficiency and learning progress

## Target Users

- **Primary**: Developers learning Vim/NeoVim who want structured practice
- **Secondary**: Experienced Vim users looking to optimize their motion efficiency
- **Tertiary**: Coding bootcamps and educational platforms teaching editor proficiency

## Technical Architecture

### Frontend
- **Framework**: React with TypeScript
- **Styling**: Tailwind CSS for rapid UI development
- **State Management**: React Query for server state, Zustand for client state
- **Vim Simulation**: Custom vim motion parser and validator
- **Code Highlighting**: Prism.js or Monaco Editor

### Backend
- **Runtime**: Node.js with Express/Fastify
- **Database**: PostgreSQL for user data, Redis for sessions/caching
- **Authentication**: JWT with refresh tokens
- **Problem Generation**: Custom algorithm with configurable difficulty
- **Motion Validation**: Vim command parser and execution simulator

## Core Features

### 1. Problem Generation Engine

**Dynamic Code Transformation System**
- Base code templates across multiple languages (JavaScript, Python, Go, etc.)
- Transformation operations:
  - Line insertions/deletions
  - Character-level edits
  - Indentation changes
  - Variable/function name modifications
  - Comment additions/removals
- Difficulty scaling based on:
  - Number of required motions
  - Complexity of motion combinations
  - Line distance for jumps
  - Text object complexity

**Optimal Solution Calculator**
- Generate all possible motion sequences
- Score sequences by efficiency (fewest keystrokes)
- Account for multiple valid optimal solutions
- Consider context-aware optimizations (word boundaries, text objects)

### 2. User Interface

**Minimal Landing Page Layout**
```
┌─────────────────────────────────────────────────┐
│ [Logo] VimMotion Trainer        [Profile][Stats]│
├─────────────────┬───────────────────────────────┤
│                 │                               │
│   Current Code  │        Target Code            │
│                 │                               │
│   [cursor here] │    [target position]          │
│                 │                               │
├─────────────────┼───────────────────────────────┤
│ Motion Input: [                    ] [Submit]   │
├─────────────────┴───────────────────────────────┤
│ Quick Reference: hjkl w b $ 0 gg G f F t T       │
│ [Hint] [Skip] [New Problem] Difficulty: [●●○○○]  │
└─────────────────────────────────────────────────┘
```

**Profile Sidebar (Collapsible)**
- User statistics dashboard
- Learning progress visualization
- Achievement badges
- Motion frequency heatmap
- Historical performance graphs

### 3. Learning Progression

**Difficulty Levels**
1. **Beginner**: Basic navigation (hjkl, w, b, e)
2. **Intermediate**: Line jumps, search, text objects
3. **Advanced**: Complex combinations, macros, registers
4. **Expert**: Optimization challenges, speed tests
5. **Master**: Custom scenarios, competition mode

**Adaptive Difficulty**
- Track user performance metrics
- Automatically adjust problem complexity
- Focus on weak areas (motions with high error rates)
- Graduation criteria between levels

### 4. Performance Analytics

**Individual Problem Metrics**
- Keystrokes used vs. optimal solution
- Time to completion
- Number of attempts
- Hint usage

**Long-term Progress Tracking**
- Motion accuracy trends
- Speed improvement over time
- Difficulty progression
- Most/least comfortable motion patterns

## API Design

### Base URL: `https://api.vimmotiontrainer.com/v1`

### Authentication Routes
```
POST /auth/register
POST /auth/login
POST /auth/refresh
POST /auth/logout
```

### User Management
```
GET  /users/profile
PUT  /users/profile
GET  /users/stats
GET  /users/achievements
```

### Problem Generation
```
GET  /problems/generate
     ?difficulty=1-5
     &language=js|py|go|rust
     &motions=basic|intermediate|advanced
     
GET  /problems/:id
POST /problems/:id/submit
     Body: { motions: string[], timeSpent: number }
     
GET  /problems/:id/hint
GET  /problems/:id/solution
```

### Progress Tracking
```
GET  /progress/overview
GET  /progress/detailed?timeframe=week|month|all
POST /progress/session
     Body: { problemsSolved: number, accuracy: number, avgTime: number }
```

### Leaderboards & Social
```
GET  /leaderboards/global?period=daily|weekly|monthly
GET  /leaderboards/friends
POST /social/friends/add
```

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  current_difficulty INTEGER DEFAULT 1,
  total_problems_solved INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Problems Table
```sql
CREATE TABLE problems (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  difficulty INTEGER NOT NULL,
  language VARCHAR(10) NOT NULL,
  current_code TEXT NOT NULL,
  target_code TEXT NOT NULL,
  optimal_solution JSONB NOT NULL, -- Array of motion sequences
  cursor_start JSONB NOT NULL,     -- {line: number, col: number}
  cursor_target JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Attempts Table
```sql
CREATE TABLE attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  problem_id UUID REFERENCES problems(id),
  submitted_solution TEXT NOT NULL,
  keystrokes_used INTEGER NOT NULL,
  optimal_keystrokes INTEGER NOT NULL,
  time_spent INTEGER NOT NULL, -- milliseconds
  is_correct BOOLEAN NOT NULL,
  hints_used INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### User Progress Table
```sql
CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  motion_type VARCHAR(50) NOT NULL, -- 'navigation', 'editing', 'text_objects'
  accuracy_rate DECIMAL(5,2),
  avg_time INTEGER,
  problems_solved INTEGER DEFAULT 0,
  last_practiced TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, motion_type)
);
```

## Problem Generation Algorithm

### Core Transformation Types

1. **Navigation Challenges**
   - Random cursor placement
   - Target positions requiring specific motions
   - Multi-step navigation sequences

2. **Editing Transformations**
   - Character insertions/deletions
   - Line manipulations
   - Word replacements
   - Case changes

3. **Text Object Operations**
   - Function/method modifications
   - String manipulations
   - Block comment changes
   - Bracket/quote operations

### Generation Process

```python
def generate_problem(difficulty: int, language: str) -> Problem:
    1. Select base code template
    2. Apply difficulty-appropriate transformations
    3. Calculate all possible solutions
    4. Rank solutions by efficiency
    5. Store optimal solution(s)
    6. Generate hint sequence
    7. Return problem object
```

### Difficulty Scaling

**Difficulty 1**: Single motion type, short distances
- `h`, `j`, `k`, `l` for adjacent movements
- `w`, `b`, `e` for word navigation

**Difficulty 2**: Motion combinations, medium distances
- `$`, `0`, `^` for line navigation
- `f`, `F`, `t`, `T` for character search

**Difficulty 3**: Multi-line operations, text objects
- `gg`, `G`, `{number}G` for line jumps
- `ci"`, `da(`, `yi{` for text objects

**Difficulty 4**: Complex combinations, efficiency focus
- `/{pattern}` for search-based navigation
- `%` for bracket matching
- Motion + operator combinations

**Difficulty 5**: Expert optimizations, competition scenarios
- Multiple cursor positions
- Macro-like sequence optimizations
- Edge case handling

## Success Metrics

### User Engagement
- Daily active users
- Session duration
- Problems completed per session
- User retention (1-day, 7-day, 30-day)

### Learning Effectiveness
- Accuracy improvement over time
- Speed improvement (keystrokes per minute)
- Difficulty progression rate
- Motion pattern adoption

### Product Quality
- Problem generation variety
- Solution accuracy validation
- System response times
- Error rates

## Technical Considerations

### Performance Requirements
- Problem generation: <100ms
- Motion validation: <50ms
- Page load time: <2s
- 99.9% uptime

### Scalability
- Support for 10,000+ concurrent users
- Horizontal scaling for problem generation
- CDN for static assets
- Database read replicas

### Security
- Rate limiting on API endpoints
- Input validation for motion sequences
- SQL injection prevention
- XSS protection

## Future Enhancements

### Phase 2 Features
- Multiplayer competitions
- Custom problem sets
- Plugin system for editors
- Mobile app version

### Phase 3 Features
- AI-powered personalized learning paths
- Integration with popular IDEs
- Team/organization accounts
- Advanced analytics dashboard

### Community Features
- User-generated problems
- Community challenges
- Motion pattern sharing
- Discussion forums

## Launch Strategy

### MVP Scope
- Basic problem generation (difficulties 1-3)
- Core web interface
- User accounts and progress tracking
- JavaScript code templates

### Beta Testing
- 100 selected users
- 2-week testing period
- Feedback collection and iteration
- Performance optimization

### Public Launch
- Marketing through developer communities
- Content marketing (blog posts, tutorials)
- Integration with coding education platforms
- Freemium pricing model

## Success Criteria

### 3-Month Goals
- 1,000 registered users
- 80% user satisfaction score
- 50% monthly active user retention
- Sub-100ms problem generation time

### 6-Month Goals
- 5,000 registered users
- Partnerships with 3 coding bootcamps
- Mobile app in development
- Revenue positive (premium features)

### 12-Month Goals
- 25,000 registered users
- Multi-language support
- Enterprise/team features
- $10k+ monthly recurring revenue