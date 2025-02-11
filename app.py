from flask import Flask, render_template, request, jsonify
import requests

app = Flask(__name__)

API_KEY = "UmY5OJyE9zOaP7AetobRrQ==akfhZquJRn7QCw2T"
API_URL = "https://api.api-ninjas.com/v1/recipe"

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/recipes')
def recipes():
    return render_template('recipes.html')

@app.route('/search', methods=['GET'])
def search():
    query = request.args.get('query', 'dinner') 
    offset = request.args.get('offset', 0, type=int)  

    headers = {'X-Api-Key': API_KEY}
    params = {"query": query, "offset": offset}

    response = requests.get(API_URL, params=params, headers=headers)

    # Debugging: Log response for errors
    print("API Request:", response.url)
    print("API Response Status:", response.status_code)
    print("API Response Data:", response.text)

    if response.status_code == 200:
        return jsonify(response.json())
    else:
        return jsonify({'error': f'Couldnt find recipes - {response.text}'}), response.status_code


if __name__ == '__main__':
    app.run(debug=True)
