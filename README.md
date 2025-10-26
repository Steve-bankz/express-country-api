# Express Country API

A RESTful API built with **Express.js** and **MySQL**, which fetches country data from external APIs, caches it in a database, computes estimated GDP, and provides CRUD operations along with a summary image.

---

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Docker Setup](#docker-setup)
- [API Endpoints](#api-endpoints)
- [Example Responses](#example-responses)
- [License](#license)

---

## Features

- Fetch country data from external APIs:
  - Country info: `https://restcountries.com/v2/all?fields=name,capital,region,population,flag,currencies`
  - Exchange rates: `https://open.er-api.com/v6/latest/USD`
- Compute estimated GDP for each country:  
  `estimated_gdp = (population * random(1000-2000)) / exchange_rate`
- Cache countries in **MySQL**.
- CRUD operations on countries.
- Filter and sort countries on retrieval.
- Generate a **summary image** with:
  - Total countries
  - Top 5 countries by estimated GDP
  - Last refresh timestamp
- Deployment-ready Docker setup.

---

## Getting Started

### Prerequisites

- Node.js >= 18
- Docker (optional for local development)
- MySQL (or Railway MySQL plugin)

### Installation

1. Clone the repo:

```bash
git clone <repo-url>
cd express-country-api
Install dependencies:

npm install


Configure environment variables (see below).

Initialize the database:

-- Run the init.sql script
source ./init.sql;


Run locally:

npm start

Environment Variables

Create a .env file in the project root:

PORT=3000
DB_HOST=localhost          # or Railway DB host
DB_USER=country_user
DB_PASSWORD=country_pass
DB_NAME=country_db


Railway automatically provides the database variables in the deployment environment.

Docker Setup
Local Development
docker-compose up --build


This will start:

App on localhost:3000

MySQL on localhost:3306 (if included in docker-compose)

Deployment

Railway builds directly from the Dockerfile.

Ensure DB connection variables come from Railway’s environment.

API Endpoints
Method	Route	Description
GET	/	Returns a simple string for testing.
POST	/countries/refresh	Fetches data from external APIs, computes GDP, updates/inserts countries, and generates summary image.
GET	/countries	Retrieves all countries. Supports query parameters for filtering and sorting.
GET	/countries/:name	Retrieves a country by name.
POST	/countries	Creates a new country record.
PUT	/countries/:name	Updates a country by name.
DELETE	/countries/:name	Deletes a country by name.
GET	/countries/image	Serves the latest summary image (summary.png).
GET	/status	Returns { total_countries, last_refreshed_at }.
Query Parameters for /countries

name — Filter by country name (case-insensitive, partial match allowed)

region — Filter by region

sort_by — Field to sort by (name, population, estimated_gdp, etc.)

order — asc or desc

Example Responses
GET /status
{
  "total_countries": 250,
  "last_refreshed_at": "2025-10-26T11:10:53.000Z"
}

GET /countries?region=Africa&sort_by=estimated_gdp&order=desc
[
  {
    "id": 1,
    "name": "Nigeria",
    "capital": "Abuja",
    "region": "Africa",
    "population": 206139589,
    "currency_code": "NGN",
    "exchange_rate": 0.0024,
    "estimated_gdp": 1234567890.12,
    "flag_url": "https://restcountries.com/data/nga.svg",
    "last_refreshed_at": "2025-10-26T11:10:53.000Z"
  },
  ...
]

POST /countries/refresh
{
  "status": "success",
  "message": "Countries refreshed successfully",
  "count": 250,
  "last_refreshed_at": "2025-10-26T11:10:53.000Z"
}
```
