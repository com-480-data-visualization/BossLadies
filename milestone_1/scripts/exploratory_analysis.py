import pandas as pd
import matplotlib.pyplot as plt
from pathlib import Path
from wordcloud import WordCloud

STOP_WORDS = {'for', 'the', 'with', 'and'}

def load_data():
    project_root = Path(__file__).resolve().parent.parent.parent
    data_dir = project_root / "data"
    
    all_files = list(data_dir.glob("FOOD-DATA-GROUP*.csv"))
    df_list = [pd.read_csv(f) for f in all_files]
    food_df = pd.concat(df_list, ignore_index=True)
    return food_df

def create_figures_folder():
    figures_path = Path(__file__).resolve().parent.parent / "figures"
    figures_path.mkdir(parents=True, exist_ok=True)
    return figures_path

def save_plot(name, dpi=300):
    figures_path = create_figures_folder()
    file_path = figures_path / f"{name}.png"
    plt.savefig(file_path, dpi=dpi, bbox_inches="tight")

def tokenize_food_name(text):
    words = str(text).split()
    return [w for w in words if w.lower() not in STOP_WORDS and len(w) > 2]

def create_word_cloud(word_to_filter, dataframe):
    # Find rows that contain the keyword
    pattern = rf'\b{word_to_filter}\b'
    subset = dataframe[dataframe['food'].str.contains(pattern, case=False, na=False)]
    
    # Get all words from these rows
    text_list = [word for sublist in subset['clean_list'] for word in sublist]
    
    # Remove the keyword itself so it doesn't show up in its own cloud
    text_list = [w for w in text_list if w.lower() != word_to_filter.lower()]
    
    if not text_list: 
        return
    
    wordcloud = WordCloud(
        width=1000, 
        height=500, 
        background_color='white',
        collocations=True, 
        max_words=50,
        colormap='Dark2'
    ).generate(" ".join(text_list))
    
    plt.figure(figsize=(12, 6))
    plt.imshow(wordcloud, interpolation='bilinear')
    plt.title(f"Words which go with '{word_to_filter}'")
    plt.axis('off')
    plt.show()
