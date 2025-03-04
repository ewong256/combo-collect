from flask import Blueprint, jsonify, request
from flask_login import login_required
from app.models import Collection, db, Clip
from app.forms.collection_form import CollectionForm


collection_routes = Blueprint("collections", __name__)

def format_errors(validation_errors):
    errorMessages = {field: [error for error in validation_errors[field]] for field in validation_errors}
    return errorMessages

@collection_routes.route("")
def get_collections():
    collections = Collection.query.all()
    return {"collections": [collection.to_dict() for collection in collections]}

@collection_routes.route("/<int:collection_id>")
def get_collection_by_id(collection_id):
    collection = Collection.query.get(collection_id)
    if not collection:
        return jsonify({"error": "Collection not found"}), 404
    return collection.to_dict()

@collection_routes.route("", methods=["POST"])
# @login_required
def create_collection():
    form = CollectionForm()
    form["csrf_token"].data = request.cookies.get("csrf_token", "")

    if form.validate_on_submit():
        new_collection = Collection()
        form.populate_obj(new_collection)

        db.session.add(new_collection)
        db.session.commit()

        return new_collection.to_dict()

    return jsonify(format_errors(form.errors)), 400

@collection_routes.route("/<int:collection_id>", methods=["PUT"])
# @login_required
def update_collection(collection_id):
    collection = Collection.query.get(collection_id)

    if not collection:
        return jsonify({"error": "Collection not found"}), 404

    form = CollectionForm()
    form["csrf_token"].data = request.cookies.get("csrf_token", "")

    if form.validate_on_submit():
        form.populate_obj(collection)
        db.session.commit()
        return collection.to_dict()

    return jsonify(format_errors(form.errors)), 400

@collection_routes.route("/<int:collection_id>", methods=["DELETE"])
# @login_required
def delete_collection(collection_id):
    collection = Collection.query.get(collection_id)

    if not collection:
        return jsonify({"error": "Collection not found"}), 404

    db.session.delete(collection)
    db.session.commit()

    return jsonify({"message": "Collection deleted successfully"})


@collection_routes.route("/<int:collection_id>/clips", methods=["POST"])
# @login_required
def add_clip_to_collection(collection_id):
    collection = Collection.query.get(collection_id)

    if not collection:
        return jsonify({"error": "Collection not found"}), 404

    data = request.get_json()
    clip_id = data.get("clip_id")

    if not clip_id:
        return jsonify({"error": "Clip ID is required"}), 400

    clip = Clip.query.get(clip_id)
    if not clip:
        return jsonify({"error": "Clip not found"}), 404

    if clip in collection.clips:
        return jsonify({"message": "Clip already in collection"}), 400

    collection.clips.append(clip)
    db.session.commit()

    return jsonify({"message": "Clip added to collection"}), 200


@collection_routes.route("/<int:collection_id>/clips/<int:clip_id>", methods=["DELETE"])
# @login_required
def remove_clip_from_collection(collection_id, clip_id):
    collection = Collection.query.get(collection_id)

    if not collection:
        return jsonify({"error": "Collection not found"}), 404

    clip = Clip.query.get(clip_id)
    if not clip:
        return jsonify({"error": "Clip not found"}), 404

    if clip not in collection.clips:
        return jsonify({"error": "Clip not in collection"}), 400

    collection.clips.remove(clip)
    db.session.commit()

    return jsonify({"message": "Clip removed from collection"}), 200
