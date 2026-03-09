# Breezy - AI-Powered Air Health Assistant

Breezy is a Next.js application that provides real-time air quality information and personalized health recommendations. It features an interactive mascot, air quality data visualization, health advisories, and a chat interface for air quality questions.

## Features

- Real-time Air Quality Index (AQI) display
- Pollutant-specific insights
- Health advisories based on current air quality
- Air quality forecasting
- Interactive AI chat assistant
- User accounts with personalized preferences
- Email notifications for air quality alerts

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with shadcn/ui components
- **AI Integration**: AI SDK with OpenAI
- **Authentication**: NextAuth.js
- **State Management**: React Hooks

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn

### Installation

1. Clone the repo
2. Run `npm install`
3. Create a `.env` file (see `.env.example`)
4. Run `npm run dev` to start

## Branch Naming Convention

- `feature/your-feature`
- `fix/bug-description`
- `hotfix/urgent-patch`

## PR Guidelines

- One feature/fix per branch
- Tag team members for review

## Before Commit (ESLint, Prettier)

`npx eslint . --ext .ts,.tsx,.js,.jsx --fix`
`npx prettier . --write`
