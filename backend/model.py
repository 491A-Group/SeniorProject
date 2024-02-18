"""
Cameron produced code to simply run the model on his local machine to get a prediction

Brian adapted it to work with Flask
"""
from ultralytics import YOLO
from io import BytesIO
from flask import Blueprint, request, jsonify
from PIL import Image

from datetime import datetime

# Load the model
model = YOLO("best.pt")

blueprint_model = Blueprint("blueprint_model", __name__)

@blueprint_model.route('/predict', methods=['POST'])
def predict():
    """BRIAN:
    This endpoint takes a POST request with the body being bytes of a jpg
    It just returns json with the results
    """
    result = model.predict(
        Image.open(BytesIO(request.data))
    )[0].tojson()

    print(result)
    return jsonify(result)