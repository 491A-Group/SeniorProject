"""
Brian wrote this unless portions are denoted otherwise

This file is for API endpoints - BACKEND
"""

from flask import Blueprint, request, jsonify
from flask_login import current_user, login_required
from backend.db_queries import db_connection_pool

from datetime import datetime

blueprint_user_post_flow =  Blueprint("blueprint_user_post_flow", __name__)

from backend.model import predict_image

@blueprint_user_post_flow.route('/predict', methods=['POST'])
@login_required
def predict():
    """BRIAN:
    This endpoint takes a POST request with the body being bytes of a jpg

    It returns json with the results AND sets the predictions & other tables to get ready to make a post

    The json it returns will be of the cars list up to 3 long: 
    [
        (pred1.confidence, pred1.label, pred1.make, pred1.model_name, pred1.start_year, pred1.end_year, pred1.car_description),
        (pred2.confidence, pred2.label, pred2.make, pred2.model_name, pred2.start_year, pred2.end_year, pred2.car_description),
        (pred3.confidence, pred3.label, pred3.make, pred3.model_name, pred3.start_year, pred3.end_year, pred3.car_description)
    ]
    """
    p = predict_image(image_bytes=request.data)
    combined_list = list(zip(
        p.boxes.conf.tolist(),
        [p.names[int(yolov8_id)] for yolov8_id in p.boxes.cls.tolist()]
    ))
    if not combined_list:
        return jsonify(combined_list) # returning an empty list because there were no predictions
    #print(combined_list) # DEBUG, PARTICULARLY CHECKING IF YOLOv8 ALREADY SORTS BY CONF
    combined_list = combined_list[0:3] # take only the 3 highest

    with db_connection_pool.connection() as conn:
        cur = conn.cursor()
        with conn.transaction(): # this context manager will autocommit if the end is successfully reached
            cur.execute(
                """
                INSERT INTO pictures(img_bin)
                VALUES (%s)
                RETURNING id;
                """,
                (request.data, )
            )
            # fetchone() selecting a single row with a single column. (col1, )
            picture_id = cur.fetchone()[0]
            cars = [] # the json result to return to the frontend
            #print(picture_id)

            for confidence, label in combined_list:
                print(label, confidence)
                cur.execute(
                    """
                    WITH prediction AS (
                        INSERT INTO predictions(user_id, car_id, picture_id)
                        VALUES (%s, (SELECT id FROM cars WHERE label=%s), %s)
                        RETURNING car_id
                    )
                    SELECT m.name, c.model_name, c.start_year, c.end_year, c.description
                    FROM cars c
                    JOIN manufacturers m ON m.id=c.make
                    WHERE c.id=(SELECT car_id FROM prediction);
                    """,
                    (current_user.get_int_id(), label, picture_id)
                )
                # cars.append((confidence, label) + cur.fetchone())
                make_name, model_name, year_start, year_end, description = cur.fetchone()
                cars.append({
                    "confidence": confidence,
                    "label": label,
                    "make_name": make_name,
                    "model_name": model_name,
                    "year_start": year_start,
                    "year_end": year_end,
                    "description": description
                }) # append the car we've added to the database to the json response
            print(current_user.get_int_id(), ":\n", cars)
        return jsonify(cars)
    return 'Server Error', 500


@blueprint_user_post_flow.route('/select_prediction', methods=['POST'])
@login_required
def select_prediction():
    """BRIAN:
    :^)
    """
    body = request.json
    label = body["label"]
    size = len(label)
    if size > 64:
        return 'Max length 2048. Received ' + str(size) + '.', 413 #413: Content too large

    with db_connection_pool.connection() as conn:
        cur = conn.cursor()
        with conn.transaction():
            cur.execute(
                """
                INSERT INTO posts(user_id, car_id, datetime, picture_id)
                SELECT user_id, car_id, datetime, picture_id
                FROM predictions
                WHERE user_id=%s AND car_id=(SELECT id FROM cars WHERE label=%s)
                ORDER BY datetime DESC
                LIMIT 1;
                """,
                (current_user.get_int_id(), label)
            )

            cur.execute(
                """
                DELETE FROM predictions
                WHERE user_id=%s
                """,
                (current_user.get_int_id(),)
            )
        return 'Created post', 201
    return 'Server Error', 500