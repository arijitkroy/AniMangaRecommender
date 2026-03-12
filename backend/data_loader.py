import os
import ast
import re
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer

def normalize_text(text):
    if not isinstance(text, str):
        return ""
    text = re.sub(r'[^a-zA-Z0-9\s]', ' ', text).lower()
    return re.sub(r'\s+', ' ', text).strip()

def load_datasets():
    print("Loading datasets from local Datasets folder...")
    
    # Resolve path to the Datasets folder relative to this file's directory
    # (assuming this file is in backend/ and Datasets/ is in the repo root)
    backend_dir = os.path.dirname(os.path.abspath(__file__))
    root_dir = os.path.dirname(backend_dir)
    datasets_dir = os.path.join(root_dir, "Datasets")
    
    anime_path = os.path.join(datasets_dir, "anime.csv")
    manga_path = os.path.join(datasets_dir, "manga.csv")

    anime_df = pd.read_csv(
        anime_path,
        encoding_errors="ignore",
        on_bad_lines="skip"
    )
    manga_df = pd.read_csv(
        manga_path,
        encoding_errors="ignore",
        on_bad_lines="skip"
    )
    anime_df, manga_df = _preprocess_data(anime_df, manga_df)
    anime_tfidf, manga_tfidf, anime_tfidf_matrix, manga_tfidf_matrix = _create_feature_vectors(anime_df, manga_df)
    return anime_df, manga_df, anime_tfidf, manga_tfidf, anime_tfidf_matrix, manga_tfidf_matrix

def _preprocess_data(anime_df, manga_df):
    anime_df["genres"] = anime_df["genres"].fillna("[]")
    anime_df["themes"] = anime_df["themes"].fillna("[]")
    anime_df["demographics"] = anime_df["demographics"].fillna("[]")
    anime_df["studios"] = anime_df["studios"].fillna("[]")
    anime_df["score"] = anime_df["score"].fillna(0)
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
    return anime_df, manga_df
    
def _create_feature_vectors(anime_df, manga_df):
    anime_df["combined_features"] = anime_df.apply(
        lambda row: " ".join(row["genres"] + row["themes"] + row["demographics"]),
        axis=1,
    )
    manga_df["combined_features"] = manga_df.apply(
        lambda row: " ".join(row["genres"] + row["themes"] + row["demographics"]),
        axis=1,
    )
    anime_tfidf = TfidfVectorizer(stop_words="english")
    manga_tfidf = TfidfVectorizer(stop_words="english")
    anime_tfidf_matrix = anime_tfidf.fit_transform(anime_df["combined_features"])
    manga_tfidf_matrix = manga_tfidf.fit_transform(manga_df["combined_features"])
    return anime_tfidf, manga_tfidf, anime_tfidf_matrix, manga_tfidf_matrix
