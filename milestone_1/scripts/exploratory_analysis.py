import pandas as pd
import matplotlib.pyplot as plt
from pathlib import Path

COUNTRY_NAME_MAP = {
    "Türkiye": "Turkiye",
    "Korea": "South Korea",
    "Slovak Republic": "Slovakia"
}

def load_data():
    project_root = Path(__file__).resolve().parent.parent.parent
    data_dir = project_root / "data"
    
    bli = pd.read_csv(data_dir / "better-life-index-2024.csv")
    whr = pd.read_csv(data_dir / "WHR2024.csv")
    return bli, whr

def create_figures_folder():
    figures_path = Path(__file__).resolve().parent.parent / "figures"
    figures_path.mkdir(parents=True, exist_ok=True)
    return figures_path

def save_plot(name, dpi=300):
    figures_path = create_figures_folder()
    file_path = figures_path / f"{name}.png"
    plt.savefig(file_path, dpi=dpi, bbox_inches="tight")

def normalize_country(val):
    if pd.isna(val): return val
    name = str(val).strip()
    return COUNTRY_NAME_MAP.get(name, name)