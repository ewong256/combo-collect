from app.models import db, Collection, environment, SCHEMA
from sqlalchemy.sql import text

def seed_collections():
    collection1 = Collection(
        name="Best Combos", user_id=1
    )
    collection2 = Collection(
        name="My Favorites", user_id=2
    )
    collection3 = Collection(
        name="Top 10 Moves", user_id=3
    )

    db.session.add_all([collection1, collection2, collection3])
    db.session.commit()

def undo_collections():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.collections RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM collections"))

    db.session.commit()
