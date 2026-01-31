# Troubleshooting Guide

Quick reference for diagnosing and resolving common issues in production.

## Table of Contents

- [API Issues](#api-issues)
- [Performance Issues](#performance-issues)
- [Upload Issues](#upload-issues)
- [Error Messages](#error-messages)
- [Infrastructure Issues](#infrastructure-issues)

---

## API Issues

### API Timeout (504 Gateway Timeout)

**Symptoms:**
- User sees "Request timeout" error
- Vercel logs show 504 status
- Function execution time > 10 seconds

**Diagnosis:**
```bash
# Check Vercel function logs
# Look for execution time in logs
```

**Possible Causes:**
1. Large PDF file (> 3MB)
2. Complex PDF layout causing slow parsing
3. Memory limit exceeded

**Solutions:**
1. Check file size in request logs
2. Increase function timeout in `vercel.json` (max 10s on free tier)
3. Optimize PDF parsing logic
4. Add file size validation before processing

**Prevention:**
- Enforce strict file size limits (currently 5MB)
- Add progress indicators for large files
- Implement client-side file validation

---

### High API Error Rate (422 Errors)

**Symptoms:**
- Many 422 Unprocessable Entity errors
- Users reporting "Can't analyze CV"

**Diagnosis:**
```bash
# Check error logs for patterns
# Group by error message
```

**Possible Causes:**
1. Users uploading scanned PDFs (images only)
2. Users uploading unsupported file formats
3. Corrupted PDF files

**Solutions:**
1. Improve error messages to guide users
2. Add better file validation
3. Detect scanned PDFs early and show helpful error
4. Add examples of acceptable file types

**Prevention:**
- Client-side file type validation
- Show clear upload instructions
- Add file format requirements to FAQ

---

### Rate Limit Exceeded (429 Errors)

**Symptoms:**
- Users seeing "Too many requests" error
- 429 status codes in logs

**Diagnosis:**
```bash
# Check rate limit logs
# Identify IP addresses hitting limit
```

**Possible Causes:**
1. Single user uploading many CVs
2. Bot traffic
3. Rate limit too aggressive

**Solutions:**
1. Review rate limit configuration (currently 10 req/hour per IP)
2. Check for bot patterns
3. Consider increasing limit for legitimate use
4. Add rate limit info to UI

---

## Performance Issues

### Slow Page Load

**Symptoms:**
- First Contentful Paint > 2 seconds
- Users reporting slow loading

**Diagnosis:**
```bash
# Run Lighthouse audit
npm run build
# Check bundle size
```

**Possible Causes:**
1. Large JavaScript bundle
2. Unoptimized images
3. Too many dependencies

**Solutions:**
1. Analyze bundle: `ANALYZE=true npm run build`
2. Code split large components
3. Lazy load heavy features
4. Optimize images with Next.js Image component

---

### Slow API Response

**Symptoms:**
- API response time > 3 seconds
- Users seeing long loading spinner

**Diagnosis:**
- Check Vercel function logs for execution time
- Profile PDF parsing code

**Possible Causes:**
1. Inefficient PDF parsing
2. Large files
3. Cold start latency

**Solutions:**
1. Optimize text extraction logic
2. Add caching for common patterns
3. Keep functions warm with health check pings
4. Consider upgrading Vercel plan for better performance

---

## Upload Issues

### File Upload Fails

**Symptoms:**
- User clicks upload but nothing happens
- File input doesn't trigger
- Browser console errors

**Diagnosis:**
```javascript
// Check browser console
// Network tab in DevTools
```

**Possible Causes:**
1. JavaScript error preventing upload
2. File too large (> 5MB)
3. CORS issues (unlikely with same origin)

**Solutions:**
1. Check for JavaScript errors in Sentry/logs
2. Validate file size client-side
3. Add better error handling in FileUpload component

---

### Drag & Drop Not Working

**Symptoms:**
- Files can't be dragged onto upload zone
- No visual feedback on drag

**Possible Causes:**
1. Event listeners not attached
2. CSS z-index issues
3. Browser compatibility

**Solutions:**
1. Check event handlers in FileUpload component
2. Test in different browsers
3. Add fallback to click-to-upload

---

## Error Messages

### "Could not extract sufficient text from file"

**Cause:** PDF is scanned (image-based) or has < 50 characters

**User Solution:**
- Use OCR to convert scanned PDF to text-based PDF
- Ensure PDF has selectable text
- Try re-exporting from source document

**Technical Solution:**
- Improve error message with suggestions
- Consider adding OCR support (future enhancement)

---

### "File type not supported"

**Cause:** User uploaded file other than PDF or DOCX

**User Solution:**
- Convert file to PDF or DOCX
- Export from Word/Google Docs

**Technical Solution:**
- Add client-side validation before upload
- Show accepted file types clearly

---

### "File size exceeds 5MB limit"

**Cause:** File is too large

**User Solution:**
- Compress PDF
- Remove unnecessary images
- Split into multiple pages

**Technical Solution:**
- Consider increasing limit (trade-off: cost vs UX)
- Add compression option

---

## Infrastructure Issues

### Vercel Deployment Failed

**Symptoms:**
- Deployment shows "Failed" status
- Build logs show errors

**Diagnosis:**
```bash
# Check build logs in Vercel dashboard
# Run build locally
npm run build
```

**Possible Causes:**
1. TypeScript errors
2. Missing dependencies
3. Build timeout
4. Out of memory

**Solutions:**
1. Fix TypeScript errors: `npm run build` locally
2. Install missing deps: `npm install`
3. Optimize build process
4. Increase memory limit in `vercel.json`

---

### Function Memory Exceeded

**Symptoms:**
- 502 errors
- "Function exceeded memory limit" in logs

**Possible Causes:**
1. Large PDF files
2. Memory leak in parsing code
3. Too many concurrent requests

**Solutions:**
1. Optimize memory usage in PDF parsing
2. Stream large files instead of loading into memory
3. Increase function memory in `vercel.json`
4. Add garbage collection hints

---

### Health Check Failing

**Symptoms:**
- `/api/health` returns 503
- Monitoring alerts triggered

**Diagnosis:**
```bash
curl https://cvscorer.vercel.app/api/health
```

**Possible Causes:**
1. API route error
2. Vercel outage
3. Environment variable missing

**Solutions:**
1. Check Vercel status page
2. Review health check endpoint code
3. Verify environment variables
4. Check function logs

---

## Debugging Commands

### Check Production Logs
```bash
# Via Vercel CLI
vercel logs <deployment-url>

# Via Dashboard
# https://vercel.com/dashboard → Project → Logs
```

### Test API Endpoint
```bash
# Health check
curl https://cvscorer.vercel.app/api/health

# Upload CV (with file)
curl -X POST https://cvscorer.vercel.app/api/score \
  -F "file=@test-cv.pdf"
```

### Analyze Bundle Size
```bash
ANALYZE=true npm run build
# Opens browser with bundle analysis
```

### Check for Memory Leaks
```bash
# Run with node --inspect
node --inspect node_modules/.bin/next dev
# Open chrome://inspect
```

---

## Escalation

### When to Escalate

**P0 (Critical)** - Immediate escalation:
- Site completely down
- Data breach suspected
- Major security vulnerability

**P1 (High)** - Escalate within 1 hour:
- Core feature broken (upload fails)
- High error rate (> 10%)
- Performance severely degraded

**P2 (Medium)** - Can wait for business hours:
- Minor feature broken
- Cosmetic issues
- Non-critical errors

### Who to Contact

1. **Primary**: Development team lead
2. **Secondary**: DevOps engineer (if available)
3. **Escalation**: CTO/Engineering Manager

---

## Post-Incident

After resolving any P0 or P1 issue:

1. **Document** what happened
2. **Identify** root cause
3. **Create** follow-up tasks
4. **Schedule** post-mortem meeting
5. **Update** this runbook with learnings
