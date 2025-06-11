from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import numpy as np
from io import BytesIO
from PIL import Image
import torch
import torch.nn.functional as F
from model.convnext_cbam import ConvNeXt_CBAM
import os
import gdown
from dotenv import load_dotenv
load_dotenv()

app = FastAPI()

origins = [
    "http://103.101.163.187",
    "http://103.101.163.187:80",
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:5173",
    "http://frontend",            
    "http://frontend:80",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load PyTorch model
CLASS_NAMES = ["Bacterial leaf blight", "Brown spot", "Healthy","Leaf blast", "Leaf scald","Narrow brown spot"]

# 1. Define the model structure
MODEL = ConvNeXt_CBAM(num_classes=len(CLASS_NAMES))
# 2. Tải model từ Google Drive nếu chưa có
GDRIVE_FILE_ID = os.getenv("GDRIVE_FILE_ID")
MODEL_PATH = "saved_models/deploy_model.pth"
GDRIVE_URL = f"https://drive.google.com/uc?id={GDRIVE_FILE_ID}"

if not os.path.exists(MODEL_PATH):
    print("Model file not found. Downloading from Google Drive...")
    os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
    gdown.download(GDRIVE_URL, MODEL_PATH, quiet=False)

# 3. Load model
MODEL.load_state_dict(torch.load(MODEL_PATH, map_location=torch.device('cpu')))
MODEL.eval()

# # 2. Load the saved state_dict into the model
# MODEL.load_state_dict(torch.load("saved_models/deploy_model.pth", map_location=torch.device('cpu')))

# # 3. Set the model to evaluation mode
# MODEL.eval()



def read_file_as_image(data) -> np.ndarray:
    image = Image.open(BytesIO(data)).convert("RGB")
    return np.array(image)

# Add transform (PyTorch needs tensor and normalization usually)
from torchvision import transforms

transform = transforms.Compose([
    transforms.ToTensor(),
    transforms.Resize((224, 224)),  # Adjust size if needed (depends on your model!)
    transforms.Normalize([0.5, 0.5, 0.5], [0.5, 0.5, 0.5])  # Example normalization
])

@app.get("/ping")
async def ping():
    return "Hello, I am alive"

@app.post("/predict")
async def predict(
    file: UploadFile = File(...)
):
    image = read_file_as_image(await file.read())
    image = transform(Image.fromarray(image)).unsqueeze(0)  # Add batch dimension

    with torch.no_grad():
        predictions = MODEL(image)
        probabilities = F.softmax(predictions, dim=1)
        confidence, predicted_class = torch.max(probabilities, 1)
    
    return {
        'class': CLASS_NAMES[predicted_class.item()],
        'confidence': float(confidence.item())
    }

if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8000)
