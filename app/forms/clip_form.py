from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, FileField, TextAreaField
from wtforms.validators import DataRequired, ValidationError
from app.models import Clip

class ClipForm(FlaskForm):
    title = StringField("title", validators=[DataRequired()])
    user_id = IntegerField("user_id", validators=[DataRequired()])
    description = TextAreaField("description")
    file_url = StringField("file_url", validators=[DataRequired()])
