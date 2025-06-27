from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
import razorpay
import uuid
import os
from dotenv import load_dotenv
from supabase import create_client


load_dotenv()
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
RAZORPAY_KEY = os.getenv("RAZORPAY_KEY")
RAZORPAY_SECRET = os.getenv("RAZORPAY_SECRET")

supabase= create_client(SUPABASE_URL, SUPABASE_KEY)
razorpay_client= razorpay.Client(auth=(RAZORPAY_KEY, RAZORPAY_SECRET))

app = FastAPI()

#cors config
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def h_check():
    return JSONResponse(content={"status":"active", "message":"polaroid api"})

@app.get("/favicon.ico", include_in_schema=False)
async def favicon():
    return FileResponse("favicon.ico")
@app.post("/upload")
async def upload_image(file: UploadFile =File(...)):
    file_ext = file.filename.split('.')[-1]
    filename = f"{uuid.uuid()}.{file_ext}"
    file_bytes = await file.read()

    #to supabase
    res = supabase.storage.from_("polariods").upload(filename, file_bytes)
    if res.get('error'):
        raise HTTPException(500, "try reuploading")
    
    public_url = supabase.storage.from_("polariods").get_public_url(filename)
    return {"image_url": public_url, "id":filename}

@app.post("/create_order")
async def create_order(amount:float):
    order = razorpay_client.order.create({
        "amount": int(amount *100),
        "currency":"INR",
        "receipt": f"order_{uuid.uuid4()}",

    })

    return {"order_id":order["id"],"amount": order["order"]}

@app.get("/download/{imagee_id}")
async def download_image(image_id:str):
    file_path =f"polaroids/{image_id}.png"
    if not os.path.exists(file_path):
        raise HTTPException(404, "iamge not found")
    return FileResponse(file_path, filename=f"polaroid_{image_id}.png")