import uuid
from datetime import datetime, timedelta
from sqlalchemy.exc import SQLAlchemyError
from database.models import Base, engine, SessionLocal, User, Category, Expense, Session

def seed_database():
    session = SessionLocal()
    try:
        # Clear existing data
        session.query(Session).delete()
        session.query(Expense).delete()
        session.query(Category).delete()
        session.query(User).delete()
        session.commit()

        # Insert sample users
        user1 = User(
            id=uuid.uuid4(),
            email="alice@example.com",
            password_hash="hashed_password_1",
            created_at=datetime.utcnow()
        )
        user2 = User(
            id=uuid.uuid4(),
            email="bob@example.com",
            password_hash="hashed_password_2",
            created_at=datetime.utcnow()
        )
        session.add_all([user1, user2])
        session.commit()

        # Insert sample categories
        category1 = Category(
            id=uuid.uuid4(),
            user_id=user1.id,
            name="Groceries",
            created_at=datetime.utcnow()
        )
        category2 = Category(
            id=uuid.uuid4(),
            user_id=user1.id,
            name="Utilities",
            created_at=datetime.utcnow()
        )
        session.add_all([category1, category2])
        session.commit()

        # Insert sample expenses
        expense1 = Expense(
            id=uuid.uuid4(),
            user_id=user1.id,
            category_id=category1.id,
            amount=150.75,
            description="Weekly grocery shopping",
            created_at=datetime.utcnow()
        )
        expense2 = Expense(
            id=uuid.uuid4(),
            user_id=user1.id,
            category_id=category2.id,
            amount=75.50,
            description="Electricity bill",
            created_at=datetime.utcnow()
        )
        session.add_all([expense1, expense2])
        session.commit()

        # Insert sample sessions
        session1 = Session(
            id=uuid.uuid4(),
            user_id=user1.id,
            token="sample_token_1",
            created_at=datetime.utcnow(),
            expires_at=datetime.utcnow() + timedelta(days=1)
        )
        session2 = Session(
            id=uuid.uuid4(),
            user_id=user2.id,
            token="sample_token_2",
            created_at=datetime.utcnow(),
            expires_at=datetime.utcnow() + timedelta(days=1)
        )
        session.add_all([session1, session2])
        session.commit()

    except SQLAlchemyError as e:
        session.rollback()
        print(f"Error seeding database: {e}")
    finally:
        session.close()

if __name__ == "__main__":
    seed_database()