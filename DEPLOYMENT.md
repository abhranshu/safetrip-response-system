# Deployment Guide

## Vercel Deployment

1. **Connect your repository to Vercel**
2. **Environment Variables**: Set `NODE_ENV=production` in Vercel dashboard
3. **Build Settings**: Vercel will auto-detect Next.js framework
4. **Deploy**: Click deploy button

## Netlify Deployment

1. **Build Command**: `npm run build`
2. **Publish Directory**: `.next`
3. **Node Version**: Set to 18.x or higher

## Manual Deployment

1. **Build**: `npm run build`
2. **Start**: `npm start`
3. **Port**: Default port 3000

## Environment Variables

Set these in your deployment platform:
- `NODE_ENV=production`
- `NEXT_PUBLIC_APP_URL=https://your-domain.com`

## Troubleshooting

- Ensure Node.js version 18+ is used
- Check that all dependencies are installed
- Verify build completes without errors
- Check deployment logs for specific errors
