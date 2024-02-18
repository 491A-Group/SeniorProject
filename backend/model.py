"""
Cameron produced code to simply run the model on his local machine to get a prediction

Brian adapted it to work with Flask
"""
from ultralytics import YOLO
import numpy as np
from tensorflow.keras.preprocessing import image
from io import BytesIO
from flask import Blueprint, request

from datetime import datetime

# Load the model
"""Cameron's comment here"""
model = YOLO("best.pt")

blueprint_model = Blueprint("blueprint_model", __name__)

@blueprint_model.route('/predict', methods=['POST'])
def predict():
    """BRIAN:
    This endpoint takes a POST request with the body being bytes of a jpg
    It just returns json with the results
    """
    # DEBUG
    print(str(datetime.now()) + "\n", str(request.get_data(as_text=True)), "\n\n\n")

    # img = image.load_img(picture, target_size=(224,224))
    # img = image.img_to_array(img)
    # img = np.expand_dims(img, axis=0)
    # img = img / 255.0

    # # Make predictions
    # predictions = model.predict(img)
    #return "Predicted classes:" + str([labels[i] for i in top3_classes])
    
    #return model.predict("PATH/TO/IMAGE")[0].tojson()\
    # BytesIO outputs a file-like object from the binary. 
    return model.predict(
            BytesIO(request.data)
    )[0].tojson()
