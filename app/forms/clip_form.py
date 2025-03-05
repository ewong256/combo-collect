from flask_wtf import FlaskForm
from flask_wtf.file import FileAllowed, FileField, FileRequired
from wtforms import StringField, IntegerField, TextAreaField
from wtforms.validators import DataRequired, ValidationError
from app.api.aws_helpers import ALLOWED_EXTENSIONS
from app.models import Clip

class ClipForm(FlaskForm):
    title = StringField("title", validators=[DataRequired()])
    user_id = IntegerField("user_id", validators=[DataRequired()])
    description = TextAreaField("description")
    file_url = FileField("file_url", validators=[FileRequired(), FileAllowed(ALLOWED_EXTENSIONS)])
