from app.models import db, Clip, environment, SCHEMA
from sqlalchemy.sql import text

def seed_clips():
    clip1 = Clip(
        title="Insane Combo", description="A crazy 10-hit combo!",
        file_url="https://example.com/clip1.mp4", user_id=1
    )
    clip2 = Clip(
        title="Perfect Execution", description="Frame-perfect inputs!",
        file_url="https://example.com/clip2.mp4", user_id=2
    )
    clip3 = Clip(
        title="Comeback Victory", description="An amazing last-second win!",
        file_url="https://example.com/clip3.mp4", user_id=3
    )

    db.session.add_all([clip1, clip2, clip3])
    db.session.commit()

def undo_clips():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.clips RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM clips"))

    db.session.commit()
