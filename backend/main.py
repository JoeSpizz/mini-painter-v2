from fastapi import FastAPI, File, UploadFile, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import os

app = FastAPI()

origins = ["http://localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SAVE_DIR = "saved_models"
os.makedirs(SAVE_DIR, exist_ok=True)

@app.post("/save_model/")
async def save_model(model: UploadFile = File(...), filename: str = Query(None)):
    try:
        # Ensure the filename has the .ply extension
        ply_filename = f"{filename}.ply" if not filename.endswith(".ply") else filename
        model_path = os.path.join(SAVE_DIR, ply_filename)

        with open(model_path, "wb") as f:
            content = await model.read()
            f.write(content)

        return {"message": "Model saved successfully", "filename": ply_filename}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/list_models/")
def list_models():
    # List only .ply files
    files = [f for f in os.listdir(SAVE_DIR) if f.endswith(".ply")]
    return {"models": [f.replace(".ply", "") for f in files]}  # Return base filenames only

@app.get("/download_model/{filename}")
def download_model(filename: str):
    model_path = os.path.join(SAVE_DIR, f"{filename}.ply")

    if not os.path.exists(model_path):
        raise HTTPException(status_code=404, detail="Model not found")

    return FileResponse(model_path, media_type="application/octet-stream", filename=f"{filename}.ply")

@app.delete("/delete_model/{filename}")
def delete_model(filename: str):
    model_path = os.path.join(SAVE_DIR, f"{filename}.ply")

    if os.path.exists(model_path):
        os.remove(model_path)

    return {"message": f"Model '{filename}' deleted successfully"}
