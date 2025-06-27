from supabase import create_client
import os
from dotenv import load_dotenv

load_dotenv()

def get_supabase():
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_KEY")

    return create_client(supabase_url, supabase_key)