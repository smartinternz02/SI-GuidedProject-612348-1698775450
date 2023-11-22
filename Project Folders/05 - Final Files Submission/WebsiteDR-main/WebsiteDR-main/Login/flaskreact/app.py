#C:\flask_dev\flaskreact\app.py
from flask import Flask, request, jsonify, session,render_template
from flask_bcrypt import Bcrypt #pip install Flask-Bcrypt = https://pypi.org/project/Flask-Bcrypt/
from flask_cors import CORS, cross_origin #ModuleNotFoundError: No module named 'flask_cors' = pip install Flask-Cors
from models import db, User
import joblib
import pandas as pd
from gevent.pywsgi import WSGIServer

from PIL import Image
import numpy as np
from utils import base64_to_pil  #has problemo
# import pybase64
from models_.model import build_model
# from 

app = Flask(__name__)
 
app.config['SECRET_KEY'] = 'surya'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///flaskdb.db'
# Model saved with Keras model.save()
MODEL_PATH = "E://bsury//Summer Vacation//Smart_Project//WebsiteDR//Login//flaskreact//models_//pretrained//pretrained//model.h5"
#E://bsury//Summer Vacation//Smart_Project//WebsiteDR//Login//flaskreact//models_//pretrained//pretrained//model.h5

# Loading trained model
model = build_model()
model.load_weights(MODEL_PATH)
print('Model loaded. Start serving...')
SQLALCHEMY_TRACK_MODIFICATIONS = False
SQLALCHEMY_ECHO = True
  
bcrypt = Bcrypt(app) 
CORS(app, supports_credentials=True)
db.init_app(app)
  
with app.app_context():
    db.create_all()

def model_predict(img, model):
    """
    Classify the severity of DR of image using pre-trained CNN model.

    Keyword arguments:
    img -- the retinal image to be classified
    model -- the pretrained CNN model used for prediction

    Predicted rating of severity of diabetic retinopathy on a scale of 0 to 4:

    0 - No DR
    1 - Mild
    2 - Moderate
    3 - Severe
    4 - Proliferative DR

    """
    
    ## Preprocessing the image
    x_val = np.empty((1, 224, 224, 3), dtype=np.uint8)
    img = img.resize((224,) * 2, resample=Image.LANCZOS)
    x_val[0, :, :, :] = img

    preds = model.predict(x_val)
    return preds


 
@app.route("/")
def hello_world():
    return "Hello, World!"
 
@app.route("/signup", methods=["POST"])
def signup():
    email = request.json["email"]
    password = request.json["password"]
 
    user_exists = User.query.filter_by(email=email).first() is not None
 
    if user_exists:
        return jsonify({"error": "Email already exists"}), 409
     
    hashed_password = bcrypt.generate_password_hash(password)
    new_user = User(email=email, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()
 
    session["user_id"] = new_user.id
 
    return jsonify({
        "id": new_user.id,
        "email": new_user.email
        # "id": "1",
        # "email": email
    })
 
@app.route("/login", methods=["POST"])
def login_user():
    email = request.json["email"]
    password = request.json["password"]
  
    user = User.query.filter_by(email=email).first()
  
    if user is None:
        return jsonify({"error": "Unauthorized Access"}), 401  #unkown email
  
    if not bcrypt.check_password_hash(user.password, password):
        return jsonify({"error": "Unauthorized"}), 401       #unknown pasword
      
    session["user_id"] = user.id
  
    # return render_template('predict.html')  #check for this here if not comming
    return jsonify({
        "id": user.id,
        "email": user.email
    })
@app.route("/predict", methods=['GET','POST'])
def predict():
    if request.method == 'POST':
        # Get the image from post request
        # img = pybase64.b64decode((request.json))
        img = base64_to_pil(request.json)

        # Save the image to ./uploads
        img.save('./uploads/image.jpeg')

        # Make prediction on the image
        preds = model_predict(img, model)

        # Process result to find probability and class of prediction
        pred_proba = "{:.3f}".format(np.amax(preds))    # Max probability
        pred_class = np.argmax(np.squeeze(preds))

        diagnosis = ["No DR", "Mild", "Moderate", "Severe", "Proliferative DR"]

        result = diagnosis[pred_class]               # Convert to string
        
        # Serialize the result
        return jsonify(result=result, probability=pred_proba)

    return None
    # try:
    #     respred = request.json["respred"]
    #     # Load the saved model
    #     model = joblib.load('model/price_model.pkl')
        
    #     # Create a DataFrame from JSON data
    #     df = pd.DataFrame(respred)
        
    #     # Load the scaler used during training
    #     scaler = joblib.load('model/scaler.pkl')
        
    #     # Preprocess the data
    #     x_scaled = scaler.transform(df)
    #     x_scaled = pd.DataFrame(x_scaled, columns=df.columns)
        
    #     # Make predictions
    #     y_predict = model.predict(x_scaled)
    #     predicted_price = y_predict[0]
        
    #     res = {"Predicted Price of House": predicted_price}
    #     return jsonify(res), 200
    
    # except KeyError as e:
    #     error = {"error": f"KeyError: {str(e)}"}
    #     return jsonify(error), 400
    
    # except Exception as e:
    #     error = {"error": f"An error occurred: {str(e)}"}
    #     return jsonify(error), 500
 
if __name__ == "__main__":
    #app.run(debug=True)
    http_server = WSGIServer(('0.0.0.0', 5000), app)
    http_server.serve_forever()