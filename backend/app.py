import os
from flask import Flask
from flask_cors import CORS
import data_store
from routes.status import status_bp
from routes.anime import anime_bp
from routes.manga import manga_bp
from routes.search import search_bp

app = Flask(__name__)
CORS(app)

app.register_blueprint(status_bp)
app.register_blueprint(anime_bp)
app.register_blueprint(manga_bp)
app.register_blueprint(search_bp)

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
