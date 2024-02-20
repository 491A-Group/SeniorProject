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
from flask_login import login_required, current_user

# Load the model
model = YOLO("best.pt")

myPredictions = {}

blueprint_model = Blueprint("blueprint_model", __name__)

@blueprint_model.route('/predict', methods=['POST'])
@login_required
def predict():
    """BRIAN:
    This endpoint takes a POST request with the body being bytes of a jpg
    It just returns json with the results
    """
    result : Results = model.predict(Image.open(BytesIO(request.data)))[0]
    asJSON = json.loads(result.tojson())
    output = []
    maxPrediction = -9999999
    predName = ""
    for prediction in asJSON:
        if float(prediction["confidence"]) > maxPrediction:
            maxPrediction = float(prediction["confidence"])
            predName = prediction["name"]

    output.append({"name": predName, "conf": maxPrediction})
    print(output)
    #make an entry for current_user.id with output as my predictions
    myPredictions[current_user.id] = output
    return output