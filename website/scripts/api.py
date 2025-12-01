from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
from tensorflow.keras.models import load_model
from fastapi.middleware.cors import CORSMiddleware
import pickle
import numpy as np
import librosa
import io

app = FastAPI()

# Enable CORS so Next.js can talk to this
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- CONFIGURATION ---
SR = 16000
N_Mels = 128
Target_Width = 128

# --- LOAD AI BRAINS ---
print("Loading ResNet50 model...")
model = load_model('Resnet50_model.h5') 

with open('label_encoder.pkl', 'rb') as f:
    le = pickle.load(f)
print("Model loaded!")

# --- PREPROCESSING FUNCTION ---
def make_mel_spectrogram(y, sr):
    # 1. Trim silent edges
    y, _ = librosa.effects.trim(y)

    # 2. Create Mel Spectrogram
    S = librosa.feature.melspectrogram(y=y, sr=sr, n_mels=N_Mels)
    S_db = librosa.power_to_db(S, ref=np.max)

    # 3. Pad or Crop to Target_Width (128)
    if S_db.shape[1] < Target_Width:
        pad_width = Target_Width - S_db.shape[1]
        S_db = np.pad(S_db, ((0, 0), (0, pad_width)), mode='constant')
    else:
        S_db = S_db[:, :Target_Width]

    # 4. Normalize (0 to 1)
    S_Norm = (S_db - S_db.min()) / (S_db.max() - S_db.min() + 1e-6)

    # 5. Stack to 3 Channels (like an RGB image for ResNet)
    img = S_Norm.astype(np.float32)
    img3 = np.stack([img, img, img], axis=-1)
    
    return img3

# --- PREDICTION ENDPOINT ---
@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    try:
        # 1. Read audio file
        audio_content = await file.read()
        
        # 2. Load audio using librosa
        y, sr = librosa.load(io.BytesIO(audio_content), sr=SR)
        
        # 3. Create the Processed Image
        processed_image = make_mel_spectrogram(y, sr)
        
        # 4. Add Batch Dimension (1, 128, 128, 3)
        input_data = np.expand_dims(processed_image, axis=0)
        
        # 5. Predict
        prediction_probs = model.predict(input_data)
        predicted_index = np.argmax(prediction_probs, axis=1)[0]
        
        # 6. Convert Number -> Emotion Word
        result_emotion = le.classes_[predicted_index]
        confidence = float(np.max(prediction_probs))
        
        all_emotions = {}
        for idx, emotion in enumerate(le.classes_):
            all_emotions[emotion] = float(prediction_probs[0][idx])
        
        return JSONResponse(
            status_code=200,
            content={
                "emotion": result_emotion,
                "confidence": confidence,
                "allPredictions": all_emotions
            }
        )

    except Exception as e:
        return JSONResponse(
            status_code=400,
            content={"error": str(e)}
        )

# --- RUN SERVER ---
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
