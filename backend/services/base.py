from typing import Type, TypeVar, List, Optional
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from database.models import Base

ModelType = TypeVar("ModelType", bound=Base)

class CRUDService:
    def __init__(self, model: Type[ModelType]):
        self.model = model

    def create(self, db: Session, obj_in: dict) -> ModelType:
        try:
            db_obj = self.model(**obj_in)
            db.add(db_obj)
            db.commit()
            db.refresh(db_obj)
            return db_obj
        except SQLAlchemyError as e:
            db.rollback()
            raise RuntimeError(f"Error creating {self.model.__name__}: {str(e)}")

    def read(self, db: Session, id: str) -> Optional[ModelType]:
        return db.query(self.model).filter(self.model.id == id).first()

    def update(self, db: Session, id: str, obj_in: dict) -> ModelType:
        db_obj = self.read(db, id)
        if not db_obj:
            raise RuntimeError(f"{self.model.__name__} with id {id} not found.")
        try:
            for key, value in obj_in.items():
                setattr(db_obj, key, value)
            db.commit()
            db.refresh(db_obj)
            return db_obj
        except SQLAlchemyError as e:
            db.rollback()
            raise RuntimeError(f"Error updating {self.model.__name__}: {str(e)}")

    def delete(self, db: Session, id: str) -> None:
        db_obj = self.read(db, id)
        if not db_obj:
            raise RuntimeError(f"{self.model.__name__} with id {id} not found.")
        try:
            db.delete(db_obj)
            db.commit()
        except SQLAlchemyError as e:
            db.rollback()
            raise RuntimeError(f"Error deleting {self.model.__name__}: {str(e)}")