
# this is file is to be ran by itself and isn't required by the rest of the project
# it simulates a client wanting to get a prediction, like when a user presses the button on the website

import requests

file_path = input("IMG FILE PATH [EX 99nsx.jpg]: ")
if not file_path:
    file_path = "99nsx.jpg"

target_api = input("TARGET [EX http://192.168.1.69:3030/predict]: ")
if not target_api:
    target_api = "http://192.168.1.69:3030/predict"

image_file = open(file_path, "rb")      #file
image_data = image_file.read()          #bytes
response = requests.post(target_api, data=image_data)

if response.status_code == 200:
    print(response.text)
else:
    print("request failed:", response.status_code)
