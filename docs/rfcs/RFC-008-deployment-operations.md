# RFC-008: Deployment & Operations

**Status**: Draft  
**Author**: Development Team  
**Created**: January 28, 2026  
**Last Updated**: January 28, 2026

## Abstract

This RFC defines the deployment strategy, infrastructure setup, security considerations, monitoring, and operational procedures for the CVScorer application in production.

## Deployment Platform

### Vercel (Primary Platform)

**Rationale**:
- Native Next.js support with zero configuration
- Automatic serverless function deployment
- Global CDN for fast content delivery
- Free SSL certificates
- Git-based deployment workflow
- Excellent DX (Developer Experience)
- Generous free tier for portfolio projects

**Architecture on Vercel**:
```
┌─────────────────────────────────────┐
│          Vercel Edge Network        │
│              (Global CDN)           │
└─────────────┬───────────────────────┘
              │
    ┌─────────┴─────────┐
    │                   │
    ▼                   ▼
┌─────────┐      ┌──────────────┐
│ Static  │      │  Serverless  │
│ Assets  │      │  Functions   │
│ (Pages) │      │ (/api/score) │
└─────────┘      └──────────────┘
```

## Deployment Configuration

### Project Setup

**File**: `vercel.json`

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["iad1", "fra1", "syd1"],
  "functions": {
    "app/api/score/route.ts": {
      "memory": 1024,
      "maxDuration": 10
    }
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    },
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "no-store, max-age=0"
        }
      ]
    }
  ]
}
```

### Environment Variables

**Development** (`.env.local`):
```bash
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3000
LOG_LEVEL=debug
```

**Production** (Vercel Dashboard):
```bash
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://cvscorer.vercel.app
LOG_LEVEL=info
```

## CI/CD Pipeline

### GitHub Actions Workflow

**File**: `.github/workflows/deploy.yml`

```yaml
name: Deploy to Vercel

on:
  push:
    branches:
      - main
      - develop
  pull_request:
    branches:
      - main

jobs:
  lint-and-test:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linter
        run: npm run lint
      
      - name: Run type check
        run: npm run type-check
      
      - name: Run unit tests
        run: npm test -- --coverage
      
      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
          flags: unittests
          fail_ci_if_error: false
  
  build:
    runs-on: ubuntu-latest
    needs: lint-and-test
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build application
        run: npm run build
      
      - name: Check build output
        run: ls -la .next
  
  deploy-preview:
    runs-on: ubuntu-latest
    needs: build
    if: github.event_name == 'pull_request'
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Deploy to Vercel (Preview)
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          scope: ${{ secrets.VERCEL_ORG_ID }}
  
  deploy-production:
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Deploy to Vercel (Production)
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
          scope: ${{ secrets.VERCEL_ORG_ID }}
```

### Branch Strategy

```
main (production)
  ├─ develop (staging)
  └─ feature/* (preview deployments)
```

- **main**: Production deployments only
- **develop**: Staging/QA environment
- **feature/***: Automatic preview deployments for each PR

## Security Measures

### Input Validation

```typescript
// Implemented in RFC-005
- File type validation (MIME type + magic bytes check)
- File size limits (5MB max)
- Filename sanitization
- Rate limiting per IP
```

### API Security

**Rate Limiting** (using Vercel Edge Config or Upstash Redis):

```typescript
// /src/lib/rate-limit.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '1 h'), // 10 requests per hour per IP
  analytics: true,
});

export async function checkRateLimit(identifier: string) {
  const { success, limit, remaining, reset } = await ratelimit.limit(identifier);
  
  return {
    success,
    limit,
    remaining,
    reset,
  };
}
```

**Usage in API Route**:

```typescript
// /src/app/api/score/route.ts
import { checkRateLimit } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  // Get client IP
  const ip = req.ip || req.headers.get('x-forwarded-for') || 'unknown';
  
  // Check rate limit
  const { success, remaining, reset } = await checkRateLimit(ip);
  
  if (!success) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: 'Too many requests. Please try again later.',
          details: `Limit resets at ${new Date(reset).toISOString()}`,
        },
      },
      { 
        status: 429,
        headers: {
          'X-RateLimit-Limit': '10',
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': reset.toString(),
        }
      }
    );
  }
  
  // Continue with file processing...
}
```

### Content Security Policy

**File**: `/src/middleware.ts`

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // Content Security Policy
  response.headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline'", // Next.js requires unsafe-eval in dev
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      "connect-src 'self'",
      "frame-ancestors 'none'",
    ].join('; ')
  );
  
  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
```

### HTTPS & SSL

- Automatically handled by Vercel (free SSL certificate)
- Force HTTPS redirect enabled in Vercel dashboard
- HSTS header set in `vercel.json`

## Monitoring & Logging

### Application Monitoring

**Vercel Analytics** (Built-in):
- Real user monitoring (RUM)
- Core Web Vitals tracking
- Pageview analytics (if enabled)

**Sentry Integration** (Optional):

```bash
npm install @sentry/nextjs
```

**File**: `sentry.client.config.ts`

```typescript
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
  enabled: process.env.NODE_ENV === 'production',
});
```

### Logging Strategy

**Structured Logging** with Pino:

```typescript
// /src/lib/logger.ts
import pino from 'pino';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  ...(process.env.NODE_ENV === 'production'
    ? {} // JSON format for production
    : {
        transport: {
          target: 'pino-pretty',
          options: { colorize: true },
        },
      }),
});

export default logger;

// Usage
logger.info({ event: 'cv_analyzed', score: 78, duration: 1.2 });
logger.error({ event: 'analysis_failed', error: err.message });
```

### Key Metrics to Track

1. **Performance**:
   - API response time (p50, p95, p99)
   - Page load time
   - Time to first byte (TTFB)

2. **Usage**:
   - Number of uploads per day
   - Average CV score
   - Most common errors

3. **Business**:
   - Conversion rate (uploads vs page views)
   - User retention (return users)

## Error Handling & Alerting

### Error Categorization

1. **User Errors** (4xx):
   - Invalid file type
   - File too large
   - Rate limit exceeded
   → Log, return friendly error message

2. **System Errors** (5xx):
   - PDF parsing failure
   - Memory exceeded
   - Timeout
   → Log with stack trace, alert team, return generic error

### Alerting Rules

**Using Sentry or Vercel Notifications**:

- Alert on 5xx errors (> 5 in 5 minutes)
- Alert on high error rate (> 10% of requests)
- Alert on deployment failures

## Performance Optimization

### CDN & Caching

**Static Assets**:
- Automatically cached by Vercel CDN
- Cache headers set for 1 year: `Cache-Control: public, max-age=31536000, immutable`

**API Routes**:
- No caching (set in `vercel.json`)
- Each request is fresh

### Image Optimization

- Use Next.js `Image` component for automatic optimization
- WebP format with fallback

### Code Splitting

- Next.js handles automatic code splitting
- Dynamic imports for heavy components

### Bundle Analysis

```bash
npm install @next/bundle-analyzer

# Analyze bundle
ANALYZE=true npm run build
```

## Backup & Disaster Recovery

### No Data to Back Up

Since CVScorer processes files in-memory without storage:
- No user data to back up
- No database to maintain
- Recovery is simply redeploying the application

### Rollback Strategy

1. **Quick Rollback**: Revert to previous deployment in Vercel dashboard (1-click)
2. **Git Revert**: Revert commit and push to trigger new deployment
3. **Hotfix Branch**: Create hotfix branch, fix issue, merge to main

## Operational Procedures

### Deployment Process

**For Production Release**:

1. **Pre-Deployment**:
   - [ ] All tests passing
   - [ ] Code reviewed and approved
   - [ ] Documentation updated
   - [ ] Changelog updated

2. **Deployment**:
   - [ ] Merge PR to `main` branch
   - [ ] Automatic deployment triggered
   - [ ] Monitor Vercel deployment logs

3. **Post-Deployment**:
   - [ ] Smoke test: Upload a sample CV
   - [ ] Check monitoring dashboards
   - [ ] Monitor error logs for 24 hours

### Incident Response

**Severity Levels**:

| Level | Description | Response Time |
|-------|-------------|---------------|
| P0 (Critical) | Site completely down | < 15 minutes |
| P1 (High) | Major feature broken (upload fails) | < 1 hour |
| P2 (Medium) | Minor feature broken | < 4 hours |
| P3 (Low) | Cosmetic issue | Next release |

**Incident Checklist**:

1. [ ] Identify issue (error logs, user reports)
2. [ ] Assess severity
3. [ ] Create incident ticket
4. [ ] Investigate root cause
5. [ ] Apply fix (hotfix or rollback)
6. [ ] Verify fix in production
7. [ ] Post-mortem (for P0/P1)
8. [ ] Document lessons learned

### Health Checks

**Endpoint**: `/api/health`

```typescript
// /src/app/api/health/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    uptime: process.uptime(),
  };
  
  return NextResponse.json(health);
}
```

**Monitoring**: Ping `/api/health` every 5 minutes with UptimeRobot or similar

## Scaling Considerations

### Current Limits

- **Vercel Free Tier**:
  - 100 GB bandwidth/month
  - 100,000 serverless function invocations/month
  - 10 second function timeout
  - 1024 MB function memory

### Scaling Plan

If traffic exceeds free tier:

**Option 1: Upgrade Vercel Plan** ($20/month Pro)
- Increased limits
- Better analytics
- Priority support

**Option 2: Optimize Resource Usage**
- Implement aggressive caching
- Reduce function memory usage
- Optimize PDF parsing

**Option 3: Alternative Hosting**
- Self-host on VPS (DigitalOcean, AWS EC2)
- Use load balancer for traffic distribution

## Domain & DNS

### Custom Domain Setup

**Steps**:
1. Purchase domain (e.g., cvscorer.com from Namecheap)
2. Add domain in Vercel dashboard
3. Update DNS records:
   ```
   A Record: @ → 76.76.21.21 (Vercel IP)
   CNAME: www → cname.vercel-dns.com
   ```
4. Wait for DNS propagation (24-48 hours)
5. Verify SSL certificate issued

## Documentation & Runbooks

### Deployment Runbook

**File**: `/docs/runbooks/deployment.md`

```markdown
# Deployment Runbook

## Standard Deployment

1. Create PR from `develop` to `main`
2. Wait for CI checks to pass
3. Get 1 approval from team
4. Merge PR
5. Monitor deployment in Vercel dashboard
6. Perform smoke test

## Emergency Rollback

1. Go to Vercel dashboard
2. Navigate to Deployments
3. Find previous successful deployment
4. Click "Promote to Production"
5. Verify rollback successful
```

### Troubleshooting Guide

**File**: `/docs/troubleshooting.md`

```markdown
# Troubleshooting Guide

## Issue: API Timeout

**Symptoms**: 504 Gateway Timeout error

**Possible Causes**:
- Large PDF file (> 2MB)
- Complex PDF layout causing slow parsing

**Solutions**:
1. Check file size in logs
2. Increase function timeout in vercel.json (max 60s for Pro plan)
3. Optimize PDF parsing logic

## Issue: High Error Rate

**Symptoms**: Many 422 errors

**Possible Causes**:
- Users uploading scanned PDFs
- Users uploading unsupported formats

**Solutions**:
1. Review error logs to identify pattern
2. Improve error messages to guide users
3. Add more file validation checks
```

## Future Enhancements

### V1.1
- Add monitoring dashboard (Grafana/Datadog)
- Implement A/B testing framework
- Add feature flags (LaunchDarkly)

### V2.0
- Multi-region deployment
- Redis caching layer
- Background job queue for large files

---

**Approval Status**: ⏳ Pending Review  
**Dependencies**: All previous RFCs  
**Next Steps**: Execute deployment plan
