# Deployment Runbook

## Standard Deployment Process

### Pre-Deployment Checklist

- [ ] All tests passing locally (`npm test`)
- [ ] Code reviewed and approved
- [ ] Documentation updated
- [ ] CHANGELOG.md updated with version and changes

### Steps

1. **Create Pull Request**
   ```bash
   git checkout -b feature/your-feature
   # Make changes
   git add .
   git commit -m "feat: your feature description"
   git push origin feature/your-feature
   ```

2. **Wait for CI Checks**
   - Linting passes
   - All tests pass
   - Build succeeds

3. **Get Code Review**
   - Request review from team member
   - Address feedback
   - Get approval

4. **Merge to Main**
   ```bash
   # After approval, merge PR on GitHub
   # Or via command line:
   git checkout main
   git pull origin main
   git merge --no-ff feature/your-feature
   git push origin main
   ```

5. **Monitor Deployment**
   - Go to [Vercel Dashboard](https://vercel.com)
   - Watch deployment progress
   - Check build logs for errors

6. **Post-Deployment Verification**
   - Visit https://cvscorer.vercel.app
   - Upload a test CV
   - Check `/api/health` endpoint
   - Monitor error logs for 30 minutes

## Emergency Rollback

### When to Rollback

- Site is completely down
- Critical bug discovered
- Database corruption (if applicable)
- Security vulnerability

### Quick Rollback Steps

1. **Via Vercel Dashboard** (Fastest - 1 minute)
   - Go to [Vercel Deployments](https://vercel.com/dashboard/deployments)
   - Find last known good deployment
   - Click "Promote to Production"
   - Verify site is working

2. **Via Git Revert** (If dashboard unavailable)
   ```bash
   # Find the bad commit
   git log --oneline

   # Revert the commit
   git revert <commit-hash>

   # Push to trigger new deployment
   git push origin main
   ```

3. **Verify Rollback**
   - Check https://cvscorer.vercel.app
   - Test core functionality
   - Check error logs

## Hotfix Deployment

For urgent bug fixes that can't wait for normal process:

1. **Create Hotfix Branch**
   ```bash
   git checkout main
   git pull origin main
   git checkout -b hotfix/urgent-fix
   ```

2. **Make Fix**
   ```bash
   # Fix the issue
   git add .
   git commit -m "hotfix: description of urgent fix"
   ```

3. **Test Locally**
   ```bash
   npm test
   npm run build
   ```

4. **Fast-Track Merge**
   ```bash
   git push origin hotfix/urgent-fix
   # Create PR and merge immediately (skip review if critical)
   ```

5. **Monitor Closely**
   - Watch deployment in Vercel
   - Test in production immediately
   - Monitor for 1 hour

## Environment Variables

### Adding New Environment Variable

1. **Update `.env.example`**
   ```bash
   # Add your variable
   echo "NEW_VAR=default_value" >> .env.example
   ```

2. **Add to Vercel**
   - Go to Vercel Dashboard → Project Settings → Environment Variables
   - Add variable for Production, Preview, and Development
   - Click "Save"

3. **Redeploy**
   - Trigger new deployment for changes to take effect
   - Or redeploy existing deployment

## Monitoring Deployment

### Key Metrics to Watch

1. **During Deployment**
   - Build time (should be < 2 minutes)
   - No build errors
   - All routes resolving

2. **After Deployment**
   - Error rate < 1%
   - Response time < 500ms (p95)
   - No 5xx errors

### Where to Monitor

- **Vercel Dashboard**: Real-time deployment status
- **Vercel Analytics**: Traffic and performance metrics
- **Browser DevTools**: Check for console errors
- **Health Check**: `curl https://cvscorer.vercel.app/api/health`

## Common Issues

### Build Fails

**Symptoms**: Deployment fails during build phase

**Solutions**:
1. Check build logs in Vercel
2. Verify all dependencies installed: `npm ci`
3. Check for TypeScript errors: `npm run build` locally
4. Verify environment variables are set

### Deployment Succeeds but Site is Down

**Symptoms**: Build succeeds but 404 or 500 errors

**Solutions**:
1. Check Vercel function logs
2. Verify all API routes are working
3. Check for missing environment variables
4. Review middleware configuration

### Slow Performance

**Symptoms**: Site loads slowly

**Solutions**:
1. Check bundle size: `ANALYZE=true npm run build`
2. Verify CDN is working
3. Check for large images
4. Review serverless function cold starts

## Deployment Checklist

### Every Deployment

- [ ] Tests pass
- [ ] Build succeeds
- [ ] No TypeScript errors
- [ ] Environment variables set
- [ ] Health check passes post-deployment

### Major Releases

- [ ] All of above, plus:
- [ ] Release notes written
- [ ] Version bumped in package.json
- [ ] Git tag created
- [ ] Team notified
- [ ] Monitoring setup for 24 hours

## Rollback Checklist

- [ ] Rollback executed
- [ ] Site verified working
- [ ] Team notified
- [ ] Post-mortem scheduled
- [ ] Fix planned for next deployment
