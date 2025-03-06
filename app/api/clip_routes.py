from flask import Blueprint, jsonify, request
from flask_login import login_required
from app.models import Clip, db
from app.forms.clip_form import ClipForm
from app.api.aws_helpers import upload_file_to_s3, get_unique_filename, remove_file_from_s3

clip_routes = Blueprint("clips", __name__)

def format_errors(validation_errors):
    errorMessages = dict()

    for field in validation_errors:
        errorMessages[field] = [error for error in validation_errors[field]]

    return errorMessages

@clip_routes.route("")
def clips():
    clips = Clip.query.all()
    return {"clips": [clip.to_dict() for clip in clips]}


@clip_routes.route("/<int:clip_id>", methods=["GET"])
def get_clip_by_id(clip_id):
    clip = Clip.query.get(clip_id)

    if not clip:
        return jsonify({"error": "Clip not found"}), 404

    return clip.to_dict()

@clip_routes.route("", methods=["POST"])
# @login_required
def post_a_clip():

    form = ClipForm()

    form["csrf_token"].data = request.cookies["csrf_token"]

    if form.validate_on_submit():

        user_id = form.data["user_id"]
        title = form.data["title"]
        description = form.data["description"]
        file_url = form.data["file_url"]

        file_url.filename = get_unique_filename(file_url.filename)
        upload = upload_file_to_s3(file_url)
        print(upload)

        if "url" not in upload:
        # if the dictionary doesn't have a url key
        # it means that there was an error when you tried to upload
        # so you send back that error message (and you printed it above)
            return { "errors":[upload] }, 400

        url = upload["url"]

        new_clip = Clip(user_id=user_id, title=title, description=description, file_url=url)

        db.session.add(new_clip)

        db.session.commit()

    if form.errors:

        return format_errors(form.errors), 400

    return new_clip.to_dict()


@clip_routes.route("/<int:clip_id>", methods=["PUT"])
# @login_required
def update_clip(clip_id):
    clip = Clip.query.get(clip_id)

    if not clip:
        return jsonify({"error": "Clip not found"}), 404

    form = ClipForm()
    form["csrf_token"].data = request.cookies.get("csrf_token", "")

    if form.validate_on_submit():

        form.populate_obj(clip)  # Updates the existing clip with form data

        db.session.commit()
        return clip.to_dict()

    return jsonify(format_errors(form.errors)), 400


@clip_routes.route("/<int:clip_id>", methods=["DELETE"])
# @login_required
def delete_clip(clip_id):
    clip = Clip.query.get(clip_id)


    if not clip:
        return jsonify({"error": "Clip not found"}), 404


    s3_delete_response = remove_file_from_s3(clip.file_url)

    
    if s3_delete_response is not True:
        return jsonify(s3_delete_response), 500



    db.session.delete(clip)
    db.session.commit()

    return jsonify({"message": "Clip deleted successfully"})
