# Secret Santa - Acme Corp

Automates Secret Santa gift assignments for employees. Upload an employee list (CSV/XLSX) and optionally the previous year's assignments to prevent repeat pairings. The app generates valid assignments where nobody is paired with themselves and nobody gets the same person as last year.

## Tech stack

- **Backend:** Express.js (Node.js)
- **Frontend:** Next.js 14 (React)
- **Tests:** Jest + Supertest

## Project structure

```
backend/
  src/
    models/         Employee and Assignment classes
    services/       CsvService (file I/O), AssignmentEngine (core algorithm)
    controllers/    Request handling
    middleware/     Error handler, file upload (multer)
    utils/          Post-generation validator
    routes/         API routes
  tests/            Unit + integration tests
frontend/
  app/              Next.js pages
  components/       FileUpload, ResultsTable
data/               Sample CSV files for testing
```

The backend is split into models, services, and controllers to keep things modular. The assignment engine is independent of the HTTP layer — you could swap Express for anything else without touching the algorithm.

## Setup

Requires Node.js >= 18.

```bash
# install backend
cd backend
npm install

# install frontend
cd ../frontend
npm install
```

## Running

Start the backend (runs on port 4000):

```bash
cd backend
npm start
```

Start the frontend (runs on port 3000):

```bash
cd frontend
npm run dev
```

Then open http://localhost:3000.

## Running tests

```bash
cd backend
npm test
```

There are 25 tests across 5 suites covering the models, assignment engine, validator, and API endpoints.

## API

### POST /api/assign

Upload employee list + optional previous year file. Returns JSON with assignments and a CSV string.

**Request:** multipart/form-data
- `employees` (required) - CSV or XLSX with `Employee_Name` and `Employee_EmailID` columns
- `previous` (optional) - Previous year's assignment file to avoid repeat pairings

**Response:**
```json
{
  "success": true,
  "count": 15,
  "assignments": [
    {
      "Employee_Name": "Hamish Murray",
      "Employee_EmailID": "hamish.murray@acme.com",
      "Secret_Child_Name": "Charlie Wright",
      "Secret_Child_EmailID": "charlie.wright@acme.com"
    }
  ],
  "csv": "Employee_Name,Employee_EmailID,..."
}
```

### GET /api/health

Returns `{ "status": "ok" }`.

## How the algorithm works

The engine needs to produce a "derangement" — a permutation where no one maps to themselves. It shuffles the employee list (Fisher-Yates), maps each employee to the person at the same index in the shuffled copy, then checks that no assignment is a self-assignment or a blocked previous-year pairing. If any constraint fails, it reshuffles and tries again (up to 1000 attempts). After generation, the Validator independently re-checks everything before sending the response.

This is simple and works well for company-sized inputs. For very large inputs with heavy blocking, a more sophisticated graph-matching algorithm would be needed, but that's overkill here.

## Error handling

- Invalid file types are rejected at upload time
- Malformed CSV/XLSX (missing columns, bad emails) throws descriptive errors with row numbers
- If no valid assignment exists after max retries, the API returns an error explaining why
- All errors are caught by the global error handler and returned as JSON
