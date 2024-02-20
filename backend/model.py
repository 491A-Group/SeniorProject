"""
Cameron produced code to simply run the model on his local machine to get a prediction

Brian adapted it to work with Flask
"""
from ultralytics import YOLO
from io import BytesIO
from flask import Blueprint, request, jsonify
from PIL import Image
import json
from datetime import datetime
from ultralytics.engine.results import Results

# Load the model
model = YOLO("best.pt")

blueprint_model = Blueprint("blueprint_model", __name__)

@blueprint_model.route('/predict', methods=['POST'])
def predict():
    """BRIAN:
    This endpoint takes a POST request with the body being bytes of a jpg
    It just returns json with the results
    """
    result : Results = model.predict(Image.open(BytesIO(request.data)))[0]
    asJSON = json.loads(result.tojson())

    return asJSON[0]