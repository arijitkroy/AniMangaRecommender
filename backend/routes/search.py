import pandas as pd
from flask import Blueprint, jsonify, request
from data_store import anime_df, manga_df

search_bp = Blueprint('search', __name__)

def safe_list(x):
    if isinstance(x, list):
        return x
    return []

@search_bp.route("/api/search/genre", methods=["GET"])
def search_by_genre():
    try:
        genres = request.args.get("genres")
        media_type = request.args.get("media_type", "anime")
        top_n = int(request.args.get("top_n", 10))

        if not genres:
            return jsonify({"error": "Genres parameter is required"}), 400

        genre_list = [g.strip().lower() for g in genres.split(",")]

        if media_type == "anime":
            df = anime_df
            id_col = "anime_id"
        elif media_type == "manga":
            df = manga_df
            id_col = "manga_id"
        else:
            return jsonify({"error": "media_type must be 'anime' or 'manga'"}), 400

        mask = df.apply(
            lambda row: any(
                tag in [
                    *(g.lower() for g in safe_list(row["genres"])),
                    *(t.lower() for t in safe_list(row["themes"])),
                    *(d.lower() for d in safe_list(row["demographics"]))
                ]
                for tag in genre_list
            ),
            axis=1
        )

        filtered_df = (
            df[mask]
            .sort_values("score", ascending=False)
            .head(top_n)
        )

        results = []

        for _, row in filtered_df.iterrows():
            results.append({
                "id": int(row[id_col]),
                "title": str(row["title"]) if not pd.isna(row["title"]) else "Unknown",
                "type": str(row["type"]) if not pd.isna(row["type"]) else "Unknown",
                "score": float(row["score"]) if not pd.isna(row["score"]) else 0,
                "genres": safe_list(row["genres"]),
                "themes": safe_list(row["themes"]),
                "demographics": safe_list(row["demographics"]),
                "title_english": str(row["title_english"]) if "title_english" in df.columns and not pd.isna(row["title_english"]) else ""
            })

        return jsonify(results)

    except Exception as e:
        return jsonify({"error": str(e)}), 500