# Student Task Manager

React + Node.js + Express.js + MongoDB (Mongoose)

## Project Structure
```
student-task-manager/
├── backend/    (Express API + MongoDB)
└── frontend/   (React + Vite)
```

## Requirements
- Node.js 18+
- MongoDB (local installation OR free MongoDB Atlas cluster)

## 1. Run the Backend
```bash
cd backend
npm install
cp .env.example .env      # Windows: copy .env.example .env
# open .env and set MONGO_URI
npm start
```
Server runs on http://localhost:5000

## 2. Run the Frontend (new terminal)
```bash
cd frontend
npm install
cp .env.example .env      # Windows: copy .env.example .env
npm run dev
```
App opens on http://localhost:5173

## API Endpoints
| Method | Endpoint          | Description                | Success | Errors        |
|--------|-------------------|----------------------------|---------|---------------|
| GET    | /api/tasks        | Get all tasks              | 200     | 500           |
| POST   | /api/tasks        | Add task `{ "title": "" }` | 201     | 400, 500      |
| DELETE | /api/tasks/:id    | Delete task by ID          | 200     | 400, 404, 500 |
| PATCH  | /api/tasks/:id    | Toggle completed (Bonus)   | 200     | 400, 404, 500 |

## Testing Checklist
1. Add a task -> appears in list, stays after page refresh (stored in MongoDB)
2. Try an empty task -> error message, nothing is added
3. Delete a task -> removed from list and database
4. Delete all tasks -> "No tasks available" message shows
5. Tick the checkbox -> task is marked completed (Bonus)
