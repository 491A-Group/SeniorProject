"""
Cameron produced code to simply run the model on his local machine to get a prediction

Brian adapted it to work with Flask
"""
import tensorflow as tf
import numpy as np
from tensorflow.keras.preprocessing import image
from io import BytesIO
from flask import Blueprint, request

from datetime import datetime

# Load the model
"""Cameron's comment here"""
model = tf.keras.models.load_model("ACURA/")

blueprint_model = Blueprint("blueprint_model", __name__)

@blueprint_model.route('/predict', methods=['POST'])
def predict():
    """BRIAN:
    This endpoint takes a POST request with the body being bytes of a jpg
    It just returns json with the results
    """
    # BytesIO outputs a file-like object from the binary. 
    picture = BytesIO(request.data)

    # DEBUG
    print(str(datetime.now()) + "\n", str(request.data), "\n\n\n")

    img = image.load_img(picture, target_size=(224,224))
    img = image.img_to_array(img)
    img = np.expand_dims(img, axis=0)
    img = img / 255.0

    # Make predictions
    predictions = model.predict(img)

    # Post-process the predictions (e.g., get the predicted class)
    top3_classes = np.argsort(predictions[0])[::-1][:3]
    top3_probabilities = predictions[0][top3_classes]

    # DEBUG
    print(str(top3_probabilities) + "\n")

    labels = [  'CSX (2005-2009)',
                'CSX (2009-2011)',
                'EL (1997-2000)',
                'ILX (2012-2016)',
                'ILX (2016-2018)' ,
                'ILX (2018-2023)' ,
                'Integra (2022-2023)',
                'Legend (1986-1991)' ,
                'Legend (1990-1996)' ,
                'MDX (2001-2004)',
                'MDX (2004-2006)' ,
                'MDX (2006-2009)' ,
                'MDX (2010-2013)' ,
                'MDX (2013-2016)',
                'MDX (2016-2021)' ,
                'MDX (2021-2023)' ,
                'NSX (1991-2001)' ,
                'NSX (2001-2005)',
                'NSX (2016-2023)' ,
                'RDX (2006-2011)' ,
                'RL (2004-2008)' ,
                'RL (2008-2012)',
                'RLX (2013-2017)' ,
                'RLX (2017-2023)' ,
                'RSX (2002-2005)' ,
                'RSX (2005-2006)',
                'SLX (1996-1999)' ,
                'TL (1995-1998)' ,
                'TL (1999-2003)' ,
                'TL (2003-2008)',
                'TL (2008-2014)' ,
                'TLX (2015-2020)',
                'TLX (2020-2023)' ,
                'TSX (2008-2014)',
                'TSX Sport Wagon (2010-2014)' ,
                'ZDX (2009-2013)']
    return "Predicted classes:" + str([labels[i] for i in top3_classes])



'''
# CAMERON this is code we intend to change to into the future

from ultralyrics import YOLO

model = YOLO("PATH/TO/FILE")

model.predict("PATH/TO/IMAGE")[0].tojson()
'''
