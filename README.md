# Weather Intelligence App

## Overview

The Weather Intelligence App is an AI-generated web application created using Google AI Studio App Build. It allows users to search for a city and view current weather conditions, a 7-day weather forecast, and simple planning recommendations.

## Features

- Search weather by city name
- Display current weather
- Show 7-day weather forecast
- Planning recommendations based on weather
- Responsive user interface
- Error handling for invalid city searches

## APIs Used

### Open-Meteo Geocoding API
Converts the city name into latitude and longitude.

Endpoint:
https://geocoding-api.open-meteo.com/v1/search

### Open-Meteo Forecast API
Retrieves current weather and 7-day forecast.

Endpoint:
https://api.open-meteo.com/v1/forecast

## Technology Stack

- Google AI Studio App Build
- React
- Vite
- TypeScript
- Open-Meteo API
- GitHub
- Cloudflare

## Local Setup

Clone the repository:

```bash
git clone <your-github-repository-url>
```

Install dependencies:

```bash
npm install
```

Run the application:

```bash
npm run dev
```

Build the project:

```bash
npm run build
```

## Deployment

1. Generated the application using Google AI Studio App Build.
2. Connected the project to GitHub.
3. Deployed the GitHub repository using Cloudflare.
4. Verified the live deployment by testing valid and invalid city searches.

## Testing Performed

- Chennai weather search ✅
- London weather search ✅
- Invalid city search ✅
- Browser refresh validation ✅
- Responsive layout validation ✅

## Project Structure

```
src/
public/
package.json
README.md
vite.config.ts
```

## Live Application

https://your-deployment-url
