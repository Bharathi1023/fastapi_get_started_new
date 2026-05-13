from fastapi import FastAPI

app = FastAPI()


@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/abc")
async def abc():
    return {"message": "abc"}

@app.get("/{username}")
async def user(username: str):
    return {"message": f"Hello {username}"}

    