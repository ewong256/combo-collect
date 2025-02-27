from .db import db, environment, SCHEMA, add_prefix_for_prod
from .collection_clips import collection_clips
from datetime import datetime


class Collection(db.Model):
    __tablename__ = 'collections'

    if environment == "production":
            __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")))
    name = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.today)
    updated_at = db.Column(db.DateTime, default=datetime.today, onupdate=datetime.today)

    user = user = db.relationship("User", back_populates="collections")
    clips = db.relationship("Clip", secondary=collection_clips, back_populates="collections")

    def to_dict(self):
          return {
                "id": self.id,
                "user_id": self.user_id,
                "name": self.name
          }
