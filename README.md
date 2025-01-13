# Weather Application

This is a weather application built using React. It allows users to search for and view detailed weather information for cities, including daily and hourly forecasts. The app integrates with a backend API and MongoDB for data storage and retrieval, and it is deployed on Google Cloud Platform (GCP).

## Features

- **Search Weather by City and State**: Enter a city and select a state from a dropdown to fetch weather data.
- **Daily and Hourly Forecasts**: View detailed daily weather data and navigate to hourly forecasts for specific dates.
- **Favorite Cities**: Save cities to favorites and retrieve weather information for them from MongoDB.
- **Reset Functionality**: Use the clear button to reset all inputs and return to the initial state.
- **Interactive Table**: Click on dates in a weather table to view detailed data for that specific day.
- **Responsive Design**: A user-friendly interface that adapts across devices.

## Tech Stack

### Frontend
- React (with TypeScript)
- HTML5, CSS3
- Axios for API requests

### Backend
- Node.js with Express
- MongoDB for data storage

### Deployment
- Frontend deployed on Google Cloud Platform (GCP)
- Backend API connected to MongoDB

## Installation and Setup

1. Clone the repository:
   git clone https://github.com/your-username/weather-application.git
2. stall dependencies
   npm install
3. Create a .env file in the root directory and add the following variables:
   REACT_APP_API_BASE_URL=<Your Backend API URL>
   REACT_APP_GOOGLE_MAPS_API_KEY=<Your Google Maps API Key>

## Usage
  - Search for Weather:
  - Enter a city name and select a state from the dropdown.
  - Click the "Search" button to fetch weather data.
  - View Daily and Hourly Data:
  - Navigate through daily data and click on specific dates to view detailed hourly forecasts.
  - Save Favorites:
  - Mark cities as favorites and view them later using the "Favorites" button.
  - Clear Data:
  - Reset the application using the "Clear" button.
