# Breezy – AI-Assisted Air Quality Health Advisor

Breezy is an AI-assisted web platform that translates real-time air pollution data into **clear health insights and personalized safety recommendations**.

The system integrates environmental monitoring APIs, machine-readable pollutant data, and a conversational AI assistant to help users understand the health impact of air pollution and take preventive actions.

The project aims to bridge the gap between **complex environmental data and practical health decision-making**, especially for users living in highly polluted urban environments.

The application demonstrates how **data-driven systems and AI interfaces can support public health awareness and environmental decision support**.

---

# Key Features

### Real-Time Air Quality Monitoring

Displays live Air Quality Index (AQI) and pollutant concentrations including:

- PM2.5
- PM10
- NO₂
- SO₂
- O₃
- CO

Data is retrieved through the **OpenWeather Air Pollution API** and presented through an accessible dashboard.

### AI-Powered Health Assistant

An integrated conversational AI assistant helps users interpret air quality metrics and understand their health implications.

The assistant can:

- Explain AQI levels and pollutant effects
- Provide health advice based on pollution levels
- Recommend protective actions for sensitive groups

### Personalized Health Recommendations

Users receive tailored safety guidance depending on AQI levels and health sensitivity profiles such as:

- children
- elderly
- individuals with respiratory conditions

### Air Quality Forecasting

Short-term AQI predictions (24–48 hours) help users plan outdoor activities and minimize pollution exposure.

### Interactive Environmental Education

Additional modules promote environmental awareness through:

- eco-friendly daily tips
- air pollution educational insights
- environmental initiatives

### User Accounts & Personalization

Registered users can:

- save preferences
- configure air quality alerts
- customize health advisory settings

---

# System Overview

Breezy follows a **modular full-stack architecture** designed for scalability and rapid deployment.

### Frontend

Next.js (React) with Tailwind CSS and shadcn/ui components provides an accessible and responsive interface for both desktop and mobile devices.

### Backend & APIs

The backend integrates multiple external services:

- **OpenWeather API** – real-time AQI and pollutant data
- **Gemini API** – conversational AI assistant
- **Firebase** – authentication and database services

### Cloud Deployment

The platform is deployed on **Vercel**, supporting seamless CI/CD workflows and fast global delivery.

---

# Technology Stack

### Framework

Next.js 14 (App Router)

### Frontend

React
Tailwind CSS
shadcn/ui

### Backend & APIs

Node.js
REST APIs

### AI Integration

Gemini API

### Authentication & Database

Firebase Authentication
Firestore Database

### Deployment

Vercel

---

# My Contributions

My role focused on **full-stack development, AI integration, and system reliability**.

### Frontend Development
Designed and implemented the main application interface using React and Next.js.
Built responsive dashboards displaying AQI metrics, pollutant concentrations, and health advisory components.

### AI Chatbot Integration

Implemented the AI-powered assistant using the Gemini API to translate air quality data into understandable health guidance.

### Backend & Cloud Integration

Connected frontend components with backend APIs for:
• air quality data retrieval
• AQI forecasting
• location-based queries
Deployed and maintained backend services using **Firebase and Vercel**.

### Database Design

Designed the **Firestore database schema** for user accounts, preferences, and alert configuration.

### Testing & Optimization

Conducted usability testing and bug identification.
Improved performance and reliability by resolving runtime issues and optimizing API calls.

### Agile Development

Participated in sprint planning and retrospectives to refine backlog tasks and ensure sprint deliverables were completed.

---

# Getting Started

### Prerequisites

Node.js 18 or later
npm or yarn

---

### Installation

Clone the repository

```
git clone <repository-url>
cd breezy
```

Install dependencies

```
npm install
```

Create an environment file

```
.env.local
```

Add required environment variables.

---

### Required Environment Variables

```
OPENWEATHER_API_KEY=
GEMINI_API_KEY=

AUTH_SECRET=
AUTH_URL=http://localhost:3000

NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
```

---

### Run the Development Server

```
npm run dev
```

Open:

```
http://localhost:3000
```

---

# Project Purpose

Breezy demonstrates how **AI-enabled interfaces and environmental data systems can support public health awareness**.

By combining real-time pollution monitoring with conversational AI, the platform transforms complex environmental data into **actionable health information for everyday users**.

The project serves as a prototype for **future AI-driven decision-support tools in environmental health and digital healthcare applications**.
