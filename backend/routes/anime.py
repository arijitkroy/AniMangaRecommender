import re
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
            anime_idx_results = anime_df[anime_df["anime_id"] == int(anime_id)].index
            if len(anime_idx_results) == 0:
                return jsonify({"error": f"No anime found with ID {anime_id}"}), 404
            anime_idx = anime_df.index.get_loc(anime_idx_results[0])
        else:
            norm_title = normalize_text(title)
            if "norm_title" not in anime_df.columns:
                anime_df["norm_title"] = anime_df["title"].apply(normalize_text)
            if "norm_title_english" not in anime_df.columns:
                cols = anime_df.columns
                anime_df["norm_title_english"] = anime_df["title_english"].fillna("").astype(str).apply(normalize_text) if "title_english" in cols else ""
            if "search_title" not in anime_df.columns:
                synonyms = anime_df["title_synonyms"].fillna("").astype(str).apply(normalize_text) if "title_synonyms" in anime_df.columns else ""
                anime_df["search_title"] = (anime_df["norm_title"] + " " + anime_df["norm_title_english"] + " " + synonyms).str.strip()
            
            # 1. Exact match
            matches = anime_df[(anime_df["norm_title"] == norm_title) | (anime_df["norm_title_english"] == norm_title)]
            
            # 2. Lookahead for all words
            if len(matches) == 0:
                words = norm_title.split()
                if words:
                    lookahead = "".join([f"(?=.*\\b{re.escape(w)}\\b)" for w in words])
                    matches = anime_df[anime_df["search_title"].str.contains(lookahead, case=False, regex=True, na=False)]
            
            # 3. Simple substring
            if len(matches) == 0:
                matches = anime_df[anime_df["search_title"].str.contains(re.escape(norm_title), case=False, na=False)]
            
            # 4. Fuzzy overlap
            if len(matches) == 0:
                query_words = set(norm_title.split())
                if query_words:
                    def calc_overlap(t):
                        t_words = set(str(t).split())
                        if not t_words: return 0.0
                        return len(query_words.intersection(t_words)) / len(query_words)
                    scores = anime_df["search_title"].apply(calc_overlap)
                    if scores.max() >= 0.5:
                        matches = anime_df[scores == scores.max()]
            
            if len(matches) == 0:
                return jsonify({"error": f"No anime found with title containing '{title}'"}), 404
            
            if len(matches) > 1 and "scored_by" in matches.columns:
                matches = matches.sort_values(by="scored_by", ascending=False)
            
            anime_idx = anime_df.index.get_loc(matches.index[0])
        
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
                    "title": str(anime["title"]) if not pd.isna(anime["title"]) else "Unknown",
                    "type": str(anime["type"]) if not pd.isna(anime["type"]) else "Unknown",
                    "score": float(anime["score"])
                    if not pd.isna(anime["score"])
                    else 0,
                    "genres": anime["genres"],
                    "themes": anime["themes"],
                    "demographics": anime["demographics"],
                    "title_english": str(anime["title_english"]) if "title_english" in anime_df.columns and not pd.isna(anime["title_english"]) else "",
                    "similarity_score": float(anime_similarities[idx]),
                }
            )
        return jsonify(
            {
                "input_anime": {
                    "anime_id": int(anime_df.iloc[anime_idx]["anime_id"]),
                    "title": str(anime_df.iloc[anime_idx]["title"]) if not pd.isna(anime_df.iloc[anime_idx]["title"]) else "Unknown",
                    "title_english": str(anime_df.iloc[anime_idx]["title_english"]) if "title_english" in anime_df.columns and not pd.isna(anime_df.iloc[anime_idx]["title_english"]) else "",
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
                    "title": str(row["title"]) if not pd.isna(row["title"]) else "Unknown",
                    "type": str(row["type"]) if not pd.isna(row["type"]) else "Unknown",
                    "score": float(row["score"]) if not pd.isna(row["score"]) else 0,
                    "title_english": str(row["title_english"]) if "title_english" in anime_df.columns and not pd.isna(row["title_english"]) else "",
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
