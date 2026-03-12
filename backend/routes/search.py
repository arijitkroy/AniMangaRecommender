import pandas as pd
from flask import Blueprint, jsonify, request
from data_store import anime_df, manga_df

search_bp = Blueprint('search', __name__)

@search_bp.route("/api/search/genre", methods=["GET"])
def search_by_genre():
    try:
        genres = request.args.get("genres")
        media_type = request.args.get("media_type", "anime")
        top_n = int(request.args.get("top_n", 10))
        if not genres:
            return jsonify({"error": "Genres parameter is required"}), 400
        genre_list = [g.strip() for g in genres.split(",")]
        if media_type == "anime":
            df = anime_df
            id_col = "anime_id"
        elif media_type == "manga":
            df = manga_df
            id_col = "manga_id"
        else:
            return jsonify({"error": "media_type must be 'anime' or 'manga'"}), 400
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
