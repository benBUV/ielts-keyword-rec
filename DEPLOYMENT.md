# Deployment Guide

## GitHub Pages Deployment

### Prerequisites
- GitHub account
- Git installed locally
- Node.js and npm installed

### Step 1: Prepare the Repository

1. **Create a new repository on GitHub:**
   - Go to https://github.com/new
   - Name: `ielts-speaking-practice` (or your preferred name)
   - Visibility: Public or Private
   - Don't initialize with README (we already have one)

2. **Initialize Git in your project:**
   ```bash
   cd /path/to/your/project
   git init
   git add .
   git commit -m "Initial commit: IELTS Speaking Practice App"
   ```

3. **Add GitHub remote:**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/ielts-speaking-practice.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Configure for GitHub Pages

1. **Install gh-pages package:**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Update `package.json`:**
   Add these fields:
   ```json
   {
     "homepage": "https://YOUR_USERNAME.github.io/ielts-speaking-practice",
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```

3. **Update `vite.config.ts`:**
   Add base path:
   ```typescript
   export default defineConfig({
     base: '/ielts-speaking-practice/',
     // ... rest of config
   });
   ```

### Step 3: Deploy

1. **Build and deploy:**
   ```bash
   npm run deploy
   ```

2. **Enable GitHub Pages:**
   - Go to your repository on GitHub
   - Settings → Pages
   - Source: Deploy from a branch
   - Branch: `gh-pages` → `/ (root)`
   - Click Save

3. **Wait for deployment:**
   - GitHub will build and deploy your site
   - Usually takes 1-2 minutes
   - Check the Actions tab for progress

4. **Access your app:**
   ```
   https://YOUR_USERNAME.github.io/ielts-speaking-practice/
   ```

### Step 4: Canvas LMS Integration

Once deployed, use these URLs in Canvas:

**Default Questions:**
```
https://YOUR_USERNAME.github.io/ielts-speaking-practice/
```

**Technology Questions:**
```
https://YOUR_USERNAME.github.io/ielts-speaking-practice/?bank=technology
```

**Education Questions:**
```
https://YOUR_USERNAME.github.io/ielts-speaking-practice/?bank=education
```

**Environment Questions:**
```
https://YOUR_USERNAME.github.io/ielts-speaking-practice/?bank=environment
```

## Alternative Deployment Options

### Vercel

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel
   ```

3. **Follow prompts:**
   - Link to existing project or create new
   - Configure project settings
   - Deploy

4. **Use in Canvas:**
   ```
   https://your-project.vercel.app/?bank=technology
   ```

### Netlify

1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Build the project:**
   ```bash
   npm run build
   ```

3. **Deploy:**
   ```bash
   netlify deploy --prod --dir=dist
   ```

4. **Use in Canvas:**
   ```
   https://your-site.netlify.app/?bank=education
   ```

### Custom Server

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Upload `dist` folder to your server**

3. **Configure web server:**
   - Ensure all routes redirect to `index.html`
   - Enable HTTPS (required for microphone access)

4. **Use in Canvas:**
   ```
   https://your-domain.com/?bank=environment
   ```

## Important Notes

### HTTPS Requirement
- **Microphone access requires HTTPS**
- GitHub Pages provides HTTPS automatically
- For custom servers, configure SSL certificate

### Browser Compatibility
- Chrome and Edge: Full support (recommended)
- Safari: Full support
- Firefox: Limited speech recognition support

### Canvas Embedding
- The app is designed to work in iframes
- Ensure your deployment allows iframe embedding
- Test the URL directly before adding to Canvas

### CORS Configuration
- Not required for GitHub Pages
- May be needed for custom servers
- Ensure proper headers for audio recording

## Updating the App

### Update and Redeploy

1. **Make changes to your code**

2. **Commit changes:**
   ```bash
   git add .
   git commit -m "Description of changes"
   git push origin main
   ```

3. **Redeploy:**
   ```bash
   npm run deploy
   ```

### Adding New Question Banks

1. **Create question bank file:**
   - Add file to `src/data/question-banks/`
   - Follow the structure in existing files

2. **Register in loader:**
   - Edit `src/utils/question-bank-loader.ts`
   - Add import and register the bank

3. **Test locally:**
   ```bash
   npm run dev
   ```
   Open: `http://localhost:5173/?bank=your-new-bank`

4. **Deploy:**
   ```bash
   npm run deploy
   ```

5. **Update Canvas:**
   - Add new external tool with new URL
   - Or update existing tool's launch URL

## Troubleshooting

### Deployment Fails
**Problem:** `npm run deploy` fails

**Solutions:**
- Check that `gh-pages` is installed
- Verify `homepage` in `package.json` is correct
- Ensure you have push access to the repository
- Check GitHub Actions for error messages

### App Not Loading
**Problem:** Blank page after deployment

**Solutions:**
- Verify `base` path in `vite.config.ts` matches repository name
- Check browser console for errors
- Ensure GitHub Pages is enabled on correct branch
- Clear browser cache and reload

### Microphone Not Working
**Problem:** Can't record audio

**Solutions:**
- Verify site is using HTTPS
- Check browser permissions for microphone
- Test in Chrome or Edge browser
- Check browser console for permission errors

### Canvas Iframe Issues
**Problem:** App not displaying in Canvas

**Solutions:**
- Test URL directly in browser first
- Verify URL includes correct query parameters
- Check Canvas external tool configuration
- Ensure app allows iframe embedding

### Question Bank Not Loading
**Problem:** Wrong questions or error message

**Solutions:**
- Check URL parameter spelling
- Verify question bank exists in loader
- Check browser console for errors
- Test with default bank first

## Monitoring and Analytics

### GitHub Pages
- Check repository Insights → Traffic for visitor stats
- Monitor Actions tab for deployment status

### Custom Analytics
Consider adding:
- Google Analytics
- Plausible Analytics
- Custom event tracking

### Error Monitoring
Consider adding:
- Sentry for error tracking
- LogRocket for session replay
- Custom error logging

## Security Considerations

### Data Privacy
- All recordings stored in browser memory only
- No data sent to external servers
- Recordings cleared on page refresh
- No user data collected

### Microphone Access
- Requested only when needed
- User must grant permission
- Can be revoked at any time
- No audio stored on server

### Canvas Integration
- No authentication required
- No student data collected
- Safe for iframe embedding
- HTTPS ensures secure connection

## Support and Maintenance

### Regular Updates
1. Update dependencies monthly
2. Test in latest browser versions
3. Monitor for security vulnerabilities
4. Update documentation as needed

### Backup
1. Keep local copy of repository
2. Tag releases in Git
3. Document all question banks
4. Maintain changelog

### Version Control
```bash
# Create a new release
git tag -a v1.0.0 -m "Initial release"
git push origin v1.0.0

# View all releases
git tag -l
```

## Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Canvas LMS External Tools](https://community.canvaslms.com/t5/Admin-Guide/How-do-I-configure-an-external-app-for-a-course-using-a-URL/ta-p/1)
- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
