from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
import models, schemas, crud
from database import engine, Base, get_db

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create the database tables
Base.metadata.create_all(bind=engine)

@app.get("/")
async def root():
    return {"message": "Hello, Tasks!"}

# CRUD operations for tasks

# get all tasks
@app.get("/tasks", response_model=list[schemas.Task])
def read_tasks(db: Session = Depends(get_db)):
    try:
        tasks = crud.get_tasks(db)
        return tasks
    except SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail="Failed to fetch tasks") from e

# get a task by id
@app.get("/tasks/{task_id}", response_model=schemas.Task)
def read_task(task_id: int, db: Session = Depends(get_db)):
    try:
        db_task = crud.get_task(db, task_id)
        if db_task is None:
            raise HTTPException(status_code=404, detail="Task not found")
        return db_task
    except SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail="Failed to fetch task") from e

# create a new task
@app.post("/tasks", response_model=schemas.Task)
def create_task(task: schemas.TaskCreate, db: Session = Depends(get_db)):
    try:
        new_task = crud.create_task(db, task)
        return new_task
    except SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail="Failed to create task") from e

# update a task
@app.put("/tasks/{task_id}", response_model=schemas.Task)
def update_task(task_id: int, task: schemas.TaskUpdate, db: Session = Depends(get_db)):
    try:
        db_task = crud.update_task(db, task_id, task)
        if db_task is None:
            raise HTTPException(status_code=404, detail="Task not found")
        return db_task
    except SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail="Failed to update task") from e

# delete a task
@app.delete("/tasks/{task_id}", response_model=schemas.Task)
def delete_task(task_id: int, db: Session = Depends(get_db)):
    try:
        db_task = crud.delete_task(db, task_id)
        if db_task is None:
            raise HTTPException(status_code=404, detail="Task not found")
        return db_task
    except SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail="Failed to delete task") from e
