# CVScorer - AI-Powered CV Analysis

CVScorer is an intelligent resume analysis tool that helps job seekers optimize their CVs with a comprehensive 100-point scoring system. Get instant feedback on technical skills, soft skills, work experience, and more.

## 🚀 Features

- **Comprehensive Scoring**: 100-point system across 5 categories
- **400+ Technical Skills**: Recognizes programming languages, frameworks, databases, cloud platforms
- **150+ Action Verbs**: Identifies strong, professional language
- **PDF & DOCX Support**: Extract and analyze text from both formats
- **Instant Analysis**: Get results in seconds
- **Actionable Recommendations**: Priority-sorted suggestions for improvement
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Accessibility**: WCAG 2.1 AA compliant

## 📊 Scoring Categories

1. **Technical Skills** (30 points): Programming languages, frameworks, databases, cloud platforms
2. **Soft Skills** (20 points): Leadership, communication, problem-solving, teamwork
3. **Work Experience** (25 points): Length and quality of professional experience
4. **Education** (15 points): Degrees, certifications, relevant coursework
5. **Action Verbs** (10 points): Strong, professional language usage

## 🛠️ Tech Stack

- **Framework**: Next.js 16.1.6 (App Router, Turbopack)
- **UI**: React 19.2.3, TypeScript 5, Tailwind CSS 4
- **Document Processing**: pdf-parse 1.1.1, mammoth 1.11.0
- **Testing**: Jest 30.2.0, Testing Library, Playwright
- **Deployment**: Vercel (Serverless Functions)

## 📦 Getting Started

### Prerequisites

- Node.js 18.0.0 or higher
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/cvscorer.git
   cd cvscorer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate coverage report
- `npm run test:e2e` - Run Playwright E2E tests
- `npm run test:e2e:ui` - Run E2E tests with UI

## 🚢 Deployment

### Deploy to Vercel (Recommended)

CVScorer is optimized for deployment on Vercel with zero configuration needed.

#### Option 1: Deploy via GitHub (Recommended)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/cvscorer.git
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Click "Deploy"

3. **Automatic Deployments**
   - Pushes to `main` → Production deployment
   - Pull requests → Preview deployments
   - GitHub Actions runs tests automatically

#### Option 2: Deploy via CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Environment Variables

CVScorer works without any required environment variables. Optional configuration:

```bash
# Log level (default: info)
LOG_LEVEL=info

# Public API URL (auto-detected on Vercel)
NEXT_PUBLIC_API_URL=https://cvscorer.vercel.app
```

See [.env.example](.env.example) for full configuration options.

### Custom Domain

1. Go to Vercel Dashboard → Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed
4. SSL certificate automatically provisioned

### Monitoring

- **Health Check**: `https://your-domain.com/api/health`
- **Vercel Analytics**: Automatically enabled
- **Logs**: Available in Vercel Dashboard

## 📚 Documentation

- [Deployment Runbook](docs/runbooks/deployment.md) - Standard deployment procedures
- [Troubleshooting Guide](docs/runbooks/troubleshooting.md) - Common issues and solutions
- [RFC Documents](docs/rfcs/) - Technical design documents
- [Testing Guide](tests/manual/test-checklist.md) - Manual testing checklist

## 🧪 Testing

CVScorer has comprehensive test coverage:

- **109 passing tests** across unit, integration, and E2E
- **Unit Tests**: Components, hooks, utilities
- **Integration Tests**: API endpoints, scoring logic
- **E2E Tests**: Full user flows with Playwright

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

## 🔒 Security

- Content Security Policy (CSP) enforced
- HTTPS-only in production
- Input validation on all file uploads
- File size limits (5MB max)
- Rate limiting ready (10 requests/hour per IP)

## 🎯 Roadmap

### V1.1 (Planned)
- [ ] User accounts and CV history
- [ ] Export analysis as PDF
- [ ] Compare multiple CVs
- [ ] Industry-specific scoring models

### V1.2 (Future)
- [ ] AI-powered recommendations with GPT-4
- [ ] ATS (Applicant Tracking System) compatibility check
- [ ] Multi-language support
- [ ] CV template suggestions

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript strict mode
- Write tests for new features
- Update documentation
- Follow conventional commits

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org)
- UI components from [Tailwind CSS](https://tailwindcss.com)
- PDF parsing by [pdf-parse](https://www.npmjs.com/package/pdf-parse)
- DOCX parsing by [mammoth](https://www.npmjs.com/package/mammoth)

## 📞 Support

- **Documentation**: [docs/](docs/)
- **Issues**: [GitHub Issues](https://github.com/yourusername/cvscorer/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/cvscorer/discussions)

---

Made with ❤️ by [Your Name](https://github.com/yourusername)
