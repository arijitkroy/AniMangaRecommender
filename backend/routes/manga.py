import re
import numpy as np
import pandas as pd
from flask import Blueprint, jsonify, request
from sklearn.metrics.pairwise import cosine_similarity
from data_loader import normalize_text
from data_store import manga_df, manga_tfidf_matrix

manga_bp = Blueprint('manga', __name__)

@manga_bp.route("/api/manga/recommendations", methods=["GET"])
def get_manga_recommendations():
    try:
        title = request.args.get("title")
        manga_id = request.args.get("manga_id")
        top_n = int(request.args.get("top_n", 10))
        if not title and not manga_id:
            return jsonify({"error": "Either title or manga_id must be provided"}), 400
        if manga_id:
            manga_idx_results = manga_df[manga_df["manga_id"] == int(manga_id)].index
            if len(manga_idx_results) == 0:
                return jsonify({"error": f"No manga found with ID {manga_id}"}), 404
            manga_idx = manga_df.index.get_loc(manga_idx_results[0])
        else:
            norm_title = normalize_text(title)
            if "norm_title" not in manga_df.columns:
                manga_df["norm_title"] = manga_df["title"].apply(normalize_text)
            if "norm_title_english" not in manga_df.columns:
                cols = manga_df.columns
                manga_df["norm_title_english"] = manga_df["title_english"].fillna("").astype(str).apply(normalize_text) if "title_english" in cols else ""
            if "search_title" not in manga_df.columns:
                synonyms = manga_df["title_synonyms"].fillna("").astype(str).apply(normalize_text) if "title_synonyms" in manga_df.columns else ""
                manga_df["search_title"] = (manga_df["norm_title"] + " " + manga_df["norm_title_english"] + " " + synonyms).str.strip()
            
            # 1. Exact match
            matches = manga_df[(manga_df["norm_title"] == norm_title) | (manga_df["norm_title_english"] == norm_title)]
            
            # 2. Lookahead for all words
            if len(matches) == 0:
                words = norm_title.split()
                if words:
                    lookahead = "".join([f"(?=.*\\b{re.escape(w)}\\b)" for w in words])
                    matches = manga_df[manga_df["search_title"].str.contains(lookahead, case=False, regex=True, na=False)]
            
            # 3. Simple substring
            if len(matches) == 0:
                matches = manga_df[manga_df["search_title"].str.contains(re.escape(norm_title), case=False, na=False)]
            
            # 4. Fuzzy overlap
            if len(matches) == 0:
                query_words = set(norm_title.split())
                if query_words:
                    def calc_overlap(t):
                        t_words = set(str(t).split())
                        if not t_words: return 0.0
                        return len(query_words.intersection(t_words)) / len(query_words)
                    scores = manga_df["search_title"].apply(calc_overlap)
                    if scores.max() >= 0.5:
                        matches = manga_df[scores == scores.max()]
            
            if len(matches) == 0:
                return jsonify({"error": f"No manga found with title containing '{title}'"}), 404
            
            if len(matches) > 1 and "scored_by" in matches.columns:
                matches = matches.sort_values(by="scored_by", ascending=False)
            
            manga_idx = manga_df.index.get_loc(matches.index[0])
        
        manga_similarities = cosine_similarity(
            manga_tfidf_matrix[manga_idx], manga_tfidf_matrix
        ).flatten()
        similar_indices = np.argsort(manga_similarities)[::-1][1 : top_n + 1]
        recommendations = []
        for idx in similar_indices:
            manga = manga_df.iloc[idx]
            recommendations.append(
                {
                    "manga_id": int(manga["manga_id"]),
                    "title": str(manga["title"]) if not pd.isna(manga["title"]) else "Unknown",
                    "type": str(manga["type"]) if not pd.isna(manga["type"]) else "Unknown",
                    "score": float(manga["score"])
                    if not pd.isna(manga["score"])
                    else 0,
                    "genres": manga["genres"],
                    "themes": manga["themes"],
                    "demographics": manga["demographics"],
                    "title_english": str(manga["title_english"]) if "title_english" in manga_df.columns and not pd.isna(manga["title_english"]) else "",
                    "similarity_score": float(manga_similarities[idx]),
                }
            )
        return jsonify(
            {
                "input_manga": {
                    "manga_id": int(manga_df.iloc[manga_idx]["manga_id"]),
                    "title": str(manga_df.iloc[manga_idx]["title"]) if not pd.isna(manga_df.iloc[manga_idx]["title"]) else "Unknown",
                    "title_english": str(manga_df.iloc[manga_idx]["title_english"]) if "title_english" in manga_df.columns and not pd.isna(manga_df.iloc[manga_idx]["title_english"]) else "",
                },
                "recommendations": recommendations,
            }
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@manga_bp.route("/api/manga/top", methods=["GET"])
def get_top_manga():
    try:
        top_n = int(request.args.get("top_n", 10))
        min_scored_by = int(request.args.get("min_scored_by", 1000))
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
                    "title": str(row["title"]) if not pd.isna(row["title"]) else "Unknown",
                    "type": str(row["type"]) if not pd.isna(row["type"]) else "Unknown",
                    "score": float(row["score"]) if not pd.isna(row["score"]) else 0,
                    "title_english": str(row["title_english"]) if "title_english" in manga_df.columns and not pd.isna(row["title_english"]) else "",
                    "scored_by": int(row["scored_by"])
                    if not pd.isna(row["scored_by"])
                    else 0,
                }
            )
        return jsonify(results)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
        
@manga_bp.route("/api/manga/details/<int:manga_id>", methods=["GET"])
def get_manga_details(manga_id):
    try:
        idx = manga_df[manga_df["manga_id"] == manga_id].index
        if len(idx) == 0:
            return jsonify({"error": f"No manga found with ID {manga_id}"}), 404
        record = manga_df.iloc[idx[0]].to_dict()
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
