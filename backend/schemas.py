from pydantic import BaseModel

# Schema for Task
class TaskBase(BaseModel):
    title: str
    description: str
    completed: bool = False

class TaskCreate(TaskBase):
    pass

class TaskUpdate(TaskBase):
    pass

class Task(TaskBase):
    id: int

    class Config:
        from_attributes = True
