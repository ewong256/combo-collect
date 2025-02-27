from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime

collection_clips = db.Table(
    "collection_clips",
    db.Model.metadata,
    db.Column("clip_id", db.Integer, db.ForeignKey(add_prefix_for_prod("clips.id")), primary_key=True),
    db.Column("collection_id", db.Integer, db.ForeignKey(add_prefix_for_prod("collections.id")), primary_key=True),
    db.Column("created_at", db.DateTime, default=datetime.today),
    db.Column("updated_at", db.DateTime, default=datetime.today, onupdate=datetime.today),
    schema=SCHEMA if environment == "production" else None
)
