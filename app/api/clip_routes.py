from flask import Blueprint, jsonify, request
from flask_login import login_required
from app.models import Clip, db
from app.forms.clip_form import ClipForm

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
        new_clip = Clip()
        form.populate_obj(new_clip)

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

    db.session.delete(clip)
    db.session.commit()

    return jsonify({"message": "Clip deleted successfully"})
