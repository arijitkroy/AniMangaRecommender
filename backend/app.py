import ast
import os

import re
import numpy as np
import pandas as pd
import kagglehub
from flask import Flask, jsonify, request
from flask_cors import CORS
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def normalize_text(text):
    if not isinstance(text, str):
        return ""
    # Remove special characters, keep alphanumeric and spaces, convert to lowercase
    return re.sub(r'[^a-zA-Z0-9\s]', '', text).lower().strip()

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend integration

# Global variables to store our data and models
anime_df = None
manga_df = None
anime_tfidf = None
manga_tfidf = None
anime_tfidf_matrix = None
manga_tfidf_matrix = None


def load_datasets():
    """Load and preprocess the datasets"""
    global anime_df, manga_df

    print("Loading datasets dynamically from kagglehub...")
    path = kagglehub.dataset_download("andreuvallhernndez/myanimelist")

    # Load datasets
    anime_df = pd.read_csv(
        f"{path}/anime.csv",
        encoding_errors="ignore",
        on_bad_lines="skip"
    )
    manga_df = pd.read_csv(
        f"{path}/manga.csv",
        encoding_errors="ignore",
        on_bad_lines="skip"
    )

    # Preprocess data
    _preprocess_data()

    # Create feature vectors
    _create_feature_vectors()


def _preprocess_data():
    """Clean and preprocess the datasets"""
    global anime_df, manga_df

    # Process anime data
    anime_df["genres"] = anime_df["genres"].fillna("[]")
    anime_df["themes"] = anime_df["themes"].fillna("[]")
    anime_df["demographics"] = anime_df["demographics"].fillna("[]")
    anime_df["studios"] = anime_df["studios"].fillna("[]")
    anime_df["score"] = anime_df["score"].fillna(0)

    # Convert string representations of lists to actual lists
    anime_df["genres"] = anime_df["genres"].apply(
        lambda x: ast.literal_eval(x) if isinstance(x, str) else []
    )
    anime_df["themes"] = anime_df["themes"].apply(
        lambda x: ast.literal_eval(x) if isinstance(x, str) else []
    )
    anime_df["demographics"] = anime_df["demographics"].apply(
        lambda x: ast.literal_eval(x) if isinstance(x, str) else []
    )
    anime_df["studios"] = anime_df["studios"].apply(
        lambda x: ast.literal_eval(x) if isinstance(x, str) else []
    )

    # Process manga data
    manga_df["genres"] = manga_df["genres"].fillna("[]")
    manga_df["themes"] = manga_df["themes"].fillna("[]")
    manga_df["demographics"] = manga_df["demographics"].fillna("[]")
    manga_df["authors"] = manga_df["authors"].fillna("[]")
    manga_df["score"] = manga_df["score"].fillna(0)

    manga_df["genres"] = manga_df["genres"].apply(
        lambda x: ast.literal_eval(x) if isinstance(x, str) else []
    )
    manga_df["themes"] = manga_df["themes"].apply(
        lambda x: ast.literal_eval(x) if isinstance(x, str) else []
    )
    manga_df["demographics"] = manga_df["demographics"].apply(
        lambda x: ast.literal_eval(x) if isinstance(x, str) else []
    )
    manga_df["authors"] = manga_df["authors"].apply(
        lambda x: ast.literal_eval(x) if isinstance(x, str) else []
    )


def _create_feature_vectors():
    """Create TF-IDF feature vectors for content-based recommendations"""
    global \
        anime_df, \
        manga_df, \
        anime_tfidf, \
        manga_tfidf, \
        anime_tfidf_matrix, \
        manga_tfidf_matrix

    # Combine genres, themes, and demographics for anime
    anime_df["combined_features"] = anime_df.apply(
        lambda row: " ".join(row["genres"] + row["themes"] + row["demographics"]),
        axis=1,
    )

    # Combine genres, themes, and demographics for manga
    manga_df["combined_features"] = manga_df.apply(
        lambda row: " ".join(row["genres"] + row["themes"] + row["demographics"]),
        axis=1,
    )

    # Create TF-IDF vectorizers
    anime_tfidf = TfidfVectorizer(stop_words="english")
    manga_tfidf = TfidfVectorizer(stop_words="english")

    # Fit and transform the combined features
    anime_tfidf_matrix = anime_tfidf.fit_transform(anime_df["combined_features"])
    manga_tfidf_matrix = manga_tfidf.fit_transform(manga_df["combined_features"])


@app.route("/api/status", methods=["GET"])
def status():
    """Health check endpoint"""
    return jsonify(
        {
            "status": "API is running",
            "message": "Anime & Manga Recommendation System API",
        }
    )


@app.route("/api/anime/recommendations", methods=["GET"])
def get_anime_recommendations():
    """Get anime recommendations based on a given anime"""
    try:
        title = request.args.get("title")
        anime_id = request.args.get("anime_id")
        top_n = int(request.args.get("top_n", 10))

        if not title and not anime_id:
            return jsonify({"error": "Either title or anime_id must be provided"}), 400

        # Find the anime
        if anime_id:
            anime_idx = anime_df[anime_df["anime_id"] == int(anime_id)].index
            if len(anime_idx) == 0:
                return jsonify({"error": f"No anime found with ID {anime_id}"}), 404
            anime_idx = anime_idx[0]
        else:
            # Normalize the search query
            norm_title = normalize_text(title)
            
            # Create a normalized version of the titles column for searching
            if "norm_title" not in anime_df.columns:
                anime_df["norm_title"] = anime_df["title"].apply(normalize_text)

            # 1. Try exact match on normalized title
            matching_anime = anime_df[anime_df["norm_title"] == norm_title]
            
            if len(matching_anime) == 0:
                # 2. Try word boundary match (so "Naruto" matches "Naruto Shippuden", but not "Narutototo")
                # Using regex word boundaries like \bNaruto\b
                words = norm_title.split()
                if words:
                    # Create regex pattern matching all words
                    pattern = r'(?=.*\b' + r'\b)(?=.*\b'.join(words) + r'\b)'
                    matching_anime = anime_df[anime_df["norm_title"].str.contains(pattern, case=False, regex=True, na=False)]

            if len(matching_anime) == 0:
                # 3. Fallback to simple partial match (like before)
                matching_anime = anime_df[anime_df["norm_title"].str.contains(norm_title, case=False, na=False)]

            if len(matching_anime) == 0:
                # 4. Fallback to largest word overlap (best relevance for long complex titles)
                query_words = set(norm_title.split())
                if query_words:
                    scores = anime_df["norm_title"].apply(
                        lambda t: len(query_words.intersection(set(str(t).split())))
                    )
                    max_score = scores.max()
                    if max_score > 0:
                        matching_anime = anime_df[scores == max_score]

            if len(matching_anime) == 0:
                return jsonify(
                    {"error": f"No anime found with title containing '{title}'"}
                ), 404
                
            # Prefer the most popular match if there are multiple
            if len(matching_anime) > 1 and "scored_by" in matching_anime.columns:
                matching_anime = matching_anime.sort_values(by="scored_by", ascending=False)
                
            anime_idx = matching_anime.index[0]

        # Calculate cosine similarities
        anime_similarities = cosine_similarity(
            anime_tfidf_matrix[anime_idx], anime_tfidf_matrix
        ).flatten()

        # Get top similar anime (excluding the input anime itself)
        similar_indices = np.argsort(anime_similarities)[::-1][1 : top_n + 1]

        # Create results
        recommendations = []
        for idx in similar_indices:
            anime = anime_df.iloc[idx]
            recommendations.append(
                {
                    "anime_id": int(anime["anime_id"]),
                    "title": anime["title"],
                    "type": anime["type"],
                    "score": float(anime["score"])
                    if not pd.isna(anime["score"])
                    else 0,
                    "genres": anime["genres"],
                    "themes": anime["themes"],
                    "demographics": anime["demographics"],
                    "similarity_score": float(anime_similarities[idx]),
                }
            )

        return jsonify(
            {
                "input_anime": {
                    "anime_id": int(anime_df.iloc[anime_idx]["anime_id"]),
                    "title": anime_df.iloc[anime_idx]["title"],
                },
                "recommendations": recommendations,
            }
        )

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/manga/recommendations", methods=["GET"])
def get_manga_recommendations():
    """Get manga recommendations based on a given manga"""
    try:
        title = request.args.get("title")
        manga_id = request.args.get("manga_id")
        top_n = int(request.args.get("top_n", 10))

        if not title and not manga_id:
            return jsonify({"error": "Either title or manga_id must be provided"}), 400

        # Find the manga
        if manga_id:
            manga_idx = manga_df[manga_df["manga_id"] == int(manga_id)].index
            if len(manga_idx) == 0:
                return jsonify({"error": f"No manga found with ID {manga_id}"}), 404
            manga_idx = manga_idx[0]
        else:
            # Normalize the search query
            norm_title = normalize_text(title)
            
            # Create a normalized version of the titles column for searching
            if "norm_title" not in manga_df.columns:
                manga_df["norm_title"] = manga_df["title"].apply(normalize_text)

            # 1. Try exact match on normalized title
            matching_manga = manga_df[manga_df["norm_title"] == norm_title]
            
            if len(matching_manga) == 0:
                # 2. Try word boundary match
                words = norm_title.split()
                if words:
                    pattern = r'(?=.*\b' + r'\b)(?=.*\b'.join(words) + r'\b)'
                    matching_manga = manga_df[manga_df["norm_title"].str.contains(pattern, case=False, regex=True, na=False)]

            if len(matching_manga) == 0:
                # 3. Fallback to simple partial match
                matching_manga = manga_df[manga_df["norm_title"].str.contains(norm_title, case=False, na=False)]

            if len(matching_manga) == 0:
                # 4. Fallback to largest word overlap
                query_words = set(norm_title.split())
                if query_words:
                    scores = manga_df["norm_title"].apply(
                        lambda t: len(query_words.intersection(set(str(t).split())))
                    )
                    max_score = scores.max()
                    if max_score > 0:
                        matching_manga = manga_df[scores == max_score]

            if len(matching_manga) == 0:
                return jsonify(
                    {"error": f"No manga found with title containing '{title}'"}
                ), 404
                
            # Prefer the most popular match if there are multiple
            if len(matching_manga) > 1 and "scored_by" in matching_manga.columns:
                matching_manga = matching_manga.sort_values(by="scored_by", ascending=False)
                
            manga_idx = matching_manga.index[0]

        # Calculate cosine similarities
        manga_similarities = cosine_similarity(
            manga_tfidf_matrix[manga_idx], manga_tfidf_matrix
        ).flatten()

        # Get top similar manga (excluding the input manga itself)
        similar_indices = np.argsort(manga_similarities)[::-1][1 : top_n + 1]

        # Create results
        recommendations = []
        for idx in similar_indices:
            manga = manga_df.iloc[idx]
            recommendations.append(
                {
                    "manga_id": int(manga["manga_id"]),
                    "title": manga["title"],
                    "type": manga["type"],
                    "score": float(manga["score"])
                    if not pd.isna(manga["score"])
                    else 0,
                    "genres": manga["genres"],
                    "themes": manga["themes"],
                    "demographics": manga["demographics"],
                    "similarity_score": float(manga_similarities[idx]),
                }
            )

        return jsonify(
            {
                "input_manga": {
                    "manga_id": int(manga_df.iloc[manga_idx]["manga_id"]),
                    "title": manga_df.iloc[manga_idx]["title"],
                },
                "recommendations": recommendations,
            }
        )

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/anime/top", methods=["GET"])
def get_top_anime():
    """Get top-rated anime"""
    try:
        top_n = int(request.args.get("top_n", 10))
        min_scored_by = int(request.args.get("min_scored_by", 1000))

        # Filter by minimum ratings and sort by score
        top_anime = (
            anime_df[anime_df["scored_by"] >= min_scored_by]
            .sort_values("score", ascending=False)
            .head(top_n)
        )

        results = []
        for idx, row in top_anime.iterrows():
            results.append(
                {
                    "anime_id": int(row["anime_id"]),
                    "title": row["title"],
                    "type": row["type"],
                    "score": float(row["score"]) if not pd.isna(row["score"]) else 0,
                    "scored_by": int(row["scored_by"])
                    if not pd.isna(row["scored_by"])
                    else 0,
                }
            )

        return jsonify(results)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/manga/top", methods=["GET"])
def get_top_manga():
    """Get top-rated manga"""
    try:
        top_n = int(request.args.get("top_n", 10))
        min_scored_by = int(request.args.get("min_scored_by", 1000))

        # Filter by minimum ratings and sort by score
        top_manga = (
            manga_df[manga_df["scored_by"] >= min_scored_by]
            .sort_values("score", ascending=False)
            .head(top_n)
        )

        results = []
        for idx, row in top_manga.iterrows():
            results.append(
                {
                    "manga_id": int(row["manga_id"]),
                    "title": row["title"],
                    "type": row["type"],
                    "score": float(row["score"]) if not pd.isna(row["score"]) else 0,
                    "scored_by": int(row["scored_by"])
                    if not pd.isna(row["scored_by"])
                    else 0,
                }
            )

        return jsonify(results)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/search/genre", methods=["GET"])
def search_by_genre():
    """Search for anime or manga by genre"""
    try:
        genres = request.args.get("genres")
        media_type = request.args.get("media_type", "anime")
        top_n = int(request.args.get("top_n", 10))

        if not genres:
            return jsonify({"error": "Genres parameter is required"}), 400

        # Parse genres (comma-separated)
        genre_list = [g.strip() for g in genres.split(",")]

        if media_type == "anime":
            df = anime_df
            id_col = "anime_id"
        elif media_type == "manga":
            df = manga_df
            id_col = "manga_id"
        else:
            return jsonify({"error": "media_type must be 'anime' or 'manga'"}), 400

        # Filter by genres (titles that contain any of the specified genres)
        mask = df["genres"].apply(
            lambda x: any(
                genre.lower() in [g.lower() for g in x] for genre in genre_list
            )
        )

        filtered_df = df[mask].sort_values("score", ascending=False).head(top_n)

        results = []
        for idx, row in filtered_df.iterrows():
            results.append(
                {
                    "id": int(row[id_col]),
                    "title": row["title"],
                    "type": row["type"],
                    "score": float(row["score"]) if not pd.isna(row["score"]) else 0,
                    "genres": row["genres"],
                    "themes": row["themes"],
                }
            )

        return jsonify(results)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    # Load datasets when the app starts
    load_datasets()

    # Run the Flask app
    app.run(debug=True, host="0.0.0.0", port=5000)
