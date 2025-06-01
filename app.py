from flask import Flask, render_template,request,jsonify
from flask_cors import CORS 
from helper import preprocessing, vectorizer, get_prediction

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])

@app.route('/')
def index():
    return "Hello world"


@app.route("/", methods = ['post'])
def my_post():
    text = request.form.get('text')

    preprocessed_txt = preprocessing(text)

    vectorized_txt = vectorizer(preprocessed_txt)

    prediction = get_prediction(vectorized_txt)

    label = "POSITIVE" if prediction == 'positive' else "NEGATIVE"
    return jsonify({'label': label})


if __name__ == "__main__":
    app.run()



