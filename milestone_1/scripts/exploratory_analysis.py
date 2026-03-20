import pandas as pd
import matplotlib.pyplot as plt
from pathlib import Path

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