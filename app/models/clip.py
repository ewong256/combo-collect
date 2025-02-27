from .db import db, environment, SCHEMA, add_prefix_for_prod
from .collection_clips import collection_clips
from datetime import datetime

class Clip(db.Model):
    __tablename__ = 'clips'

    if environment == "production":
            __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")))
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    file_url = db.Column(db.String(500), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.today)
    updated_at = db.Column(db.DateTime, default=datetime.today, onupdate=datetime.today)

    user = db.relationship("User", back_populates="clips")
    collections = db.relationship("Collection", secondary=collection_clips, back_populates="clips")

    def to_dict(self):
          return {
                "id": self.id,
                "user_id": self.user_id,
                "title": self.title,
                "description": self.description,
                "file_url": self.file_url
          }
