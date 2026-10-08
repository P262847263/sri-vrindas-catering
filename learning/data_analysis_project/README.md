# Data Analysis Project

This project loads and performs basic analysis on the Excel file `sv.xlsx`.

Quick start

1. Install dependencies:

```powershell
python -m pip install -r requirements.txt
```

2. Run the loader (adjust path if needed):

```powershell
python src\load_data.py --input "C:\\Users\\PRIYANKA SHARMA\\Downloads\\sv.xlsx"
```

Outputs:
- `data/sv.csv` — CSV export of the loaded sheet
- `output/` — place for analysis outputs (plots, summaries)

MERN backend (optional)

1. Install Node dependencies and start backend:

```powershell
cd backend
npm install
npm run dev   # starts server on port 5000
```

2. Import Excel into MongoDB (make sure MongoDB is running locally or set `MONGO_URI`):

```powershell
cd backend
npm run import -- "C:\\Users\\PRIYANKA SHARMA\\Downloads\\sv.xlsx"
```

3. Open the simple static viewer:

Serve the `frontend/static` folder (or point a static server to it). When the backend runs at `http://localhost:5000`, the viewer fetches `/api/data` and displays rows.

Notes:
- The backend uses a flexible schema and stores rows in the `Record` collection.
- If you want a full React frontend, run `npx create-react-app frontend` and fetch from `/api/data`.
