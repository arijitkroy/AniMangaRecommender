from data_loader import load_datasets

print('Loading global application state...')

anime_df, manga_df, anime_tfidf, manga_tfidf, anime_tfidf_matrix, manga_tfidf_matrix = load_datasets()