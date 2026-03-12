import numpy as np
import pandas as pd
from flask import Blueprint, jsonify, request
from sklearn.metrics.pairwise import cosine_similarity
from data_loader import normalize_text
from data_store import anime_df, anime_tfidf_matrix

anime_bp = Blueprint('anime', __name__)

@anime_bp.route("/api/anime/recommendations", methods=["GET"])
def get_anime_recommendations():
    try:
        title = request.args.get("title")
        anime_id = request.args.get("anime_id")
        top_n = int(request.args.get("top_n", 10))
        if not title and not anime_id:
            return jsonify({"error": "Either title or anime_id must be provided"}), 400
        if anime_id:
            anime_idx = anime_df[anime_df["anime_id"] == int(anime_id)].index
            if len(anime_idx) == 0:
                return jsonify({"error": f"No anime found with ID {anime_id}"}), 404
            anime_idx = anime_idx[0]
        else:
            norm_title = normalize_text(title)
            if "norm_title" not in anime_df.columns:
                anime_df["norm_title"] = anime_df["title"].apply(normalize_text)
            matching_anime = anime_df[anime_df["norm_title"] == norm_title]
            if len(matching_anime) == 0:
                words = norm_title.split()
                if words:
                    pattern = r'(?=.*\b' + r'\b)(?=.*\b'.join(words) + r'\b)'
                    matching_anime = anime_df[anime_df["norm_title"].str.contains(pattern, case=False, regex=True, na=False)]
            if len(matching_anime) == 0:
                matching_anime = anime_df[anime_df["norm_title"].str.contains(norm_title, case=False, na=False)]
            if len(matching_anime) == 0:
                query_words = set(norm_title.split())
                if query_words:
                    def calc_overlap_ratio(t):
                        title_words = set(str(t).lower().split())
                        if not title_words: return 0.0
                        overlap = len(query_words.intersection(title_words))
                        return overlap / len(query_words)
                    scores = anime_df["norm_title"].apply(calc_overlap_ratio)
                    max_score = scores.max()
                    if max_score >= 0.5:
                        matching_anime = anime_df[scores == max_score]
            if len(matching_anime) == 0:
                return jsonify(
                    {"error": f"No anime found with title containing '{title}'"}
                ), 404
            if len(matching_anime) > 1 and "scored_by" in matching_anime.columns:
                matching_anime = matching_anime.sort_values(by="scored_by", ascending=False)
            anime_idx = matching_anime.index[0]
        anime_similarities = cosine_similarity(
            anime_tfidf_matrix[anime_idx], anime_tfidf_matrix
        ).flatten()
        similar_indices = np.argsort(anime_similarities)[::-1][1 : top_n + 1]
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

@anime_bp.route("/api/anime/top", methods=["GET"])
def get_top_anime():
    try:
        top_n = int(request.args.get("top_n", 10))
        min_scored_by = int(request.args.get("min_scored_by", 1000))
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
        
@anime_bp.route("/api/anime/details/<int:anime_id>", methods=["GET"])
def get_anime_details(anime_id):
    try:
        idx = anime_df[anime_df["anime_id"] == anime_id].index
        if len(idx) == 0:
            return jsonify({"error": f"No anime found with ID {anime_id}"}), 404
        record = anime_df.iloc[idx[0]].to_dict()
        cleaned_record = {}
        for k, v in record.items():
            if isinstance(v, (list, dict, set)):
                cleaned_record[k] = v
            elif pd.isna(v):
                cleaned_record[k] = None
            else:
                cleaned_record[k] = v
        return jsonify(cleaned_record)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
