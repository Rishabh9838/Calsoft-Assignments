"""
Q3: Characters of Ice and Fire
- Fetches all characters from the API
- Finds how many seasons (TV series) each character appeared in
- Sorts characters by number of season appearances (descending)
- Exports all available sorted data to an Excel file
"""

import requests
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment
from openpyxl.utils import get_column_letter

API_URL = "https://anapioficeandfire.com/api/characters"


def fetch_all_characters(url: str) -> list[dict]:
    """Fetch all characters from the API using pagination."""
    characters = []
    page = 1
    page_size = 50

    print("Fetching characters from API...")
    while True:
        response = requests.get(url, params={"page": page, "pageSize": page_size})
        response.raise_for_status()
        data = response.json()

        if not data:
            break

        characters.extend(data)

        if page % 10 == 0:
            print(f"  Fetched {len(characters)} characters so far...")

        page += 1

    print(f"Total characters fetched: {len(characters)}\n")
    return characters


def count_season_appearances(tv_series: list[str]) -> int:
    """Count how many unique seasons a character appeared in from tv_series list."""
    season_numbers = set()
    for entry in tv_series:
        # Entries look like "Season 1", "Season 2", etc.
        parts = entry.strip().split()
        if len(parts) == 2 and parts[0].lower() == "season":
            try:
                season_numbers.add(int(parts[1]))
            except ValueError:
                pass
    return len(season_numbers)


def process_characters(raw_characters: list[dict]) -> list[dict]:
    """Process raw character data and compute season appearance counts."""
    processed = []
    for char in raw_characters:
        name = char.get("name", "").strip() or "Unknown"
        gender = char.get("gender", "Unknown") or "Unknown"
        culture = char.get("culture", "Unknown") or "Unknown"
        born = char.get("born", "Unknown") or "Unknown"
        died = char.get("died", "Unknown") or "Unknown"
        titles = ", ".join(char.get("titles", [])) or "None"
        aliases = ", ".join(char.get("aliases", [])) or "None"
        tv_series = char.get("tvSeries", [])
        played_by = ", ".join(char.get("playedBy", [])) or "Unknown"

        num_seasons = count_season_appearances(tv_series)
        seasons_list = ", ".join(tv_series) if tv_series else "None"

        processed.append({
            "Name": name,
            "Gender": gender,
            "Culture": culture,
            "Born": born,
            "Died": died,
            "Titles": titles,
            "Aliases": aliases,
            "TV Series": seasons_list,
            "Number of Seasons": num_seasons,
            "Played By": played_by,
        })

    return processed


def sort_by_seasons(characters: list[dict]) -> list[dict]:
    """Sort characters by number of season appearances, descending."""
    return sorted(characters, key=lambda x: x["Number of Seasons"], reverse=True)


def write_to_excel(characters: list[dict], filename: str = "characters.xlsx") -> None:
    """Write sorted character data to a formatted Excel file."""
    wb = openpyxl.Workbook()
    ws = wb.active
    ws.title = "Characters"

    # Define headers
    headers = [
        "Name", "Gender", "Culture", "Born", "Died",
        "Titles", "Aliases", "TV Series", "Number of Seasons", "Played By"
    ]

    # Header styling
    header_font = Font(bold=True, color="FFFFFF")
    header_fill = PatternFill(start_color="1F4E79", end_color="1F4E79", fill_type="solid")
    header_alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)

    # Write header row
    for col_idx, header in enumerate(headers, start=1):
        cell = ws.cell(row=1, column=col_idx, value=header)
        cell.font = header_font
        cell.fill = header_fill
        cell.alignment = header_alignment

    # Alternating row colors
    fill_light = PatternFill(start_color="DCE6F1", end_color="DCE6F1", fill_type="solid")
    fill_white = PatternFill(start_color="FFFFFF", end_color="FFFFFF", fill_type="solid")

    # Write data rows
    for row_idx, char in enumerate(characters, start=2):
        fill = fill_light if row_idx % 2 == 0 else fill_white
        for col_idx, key in enumerate(headers, start=1):
            cell = ws.cell(row=row_idx, column=col_idx, value=char.get(key, ""))
            cell.fill = fill
            cell.alignment = Alignment(vertical="top", wrap_text=True)

    # Auto-size columns (capped at 50 chars width)
    for col_idx, header in enumerate(headers, start=1):
        col_letter = get_column_letter(col_idx)
        max_len = len(header)
        for row_idx in range(2, min(len(characters) + 2, 200)):  # sample first 200 rows
            val = ws.cell(row=row_idx, column=col_idx).value
            if val:
                max_len = max(max_len, len(str(val)))
        ws.column_dimensions[col_letter].width = min(max_len + 2, 50)

    # Freeze header row
    ws.freeze_panes = "A2"

    wb.save(filename)
    print(f"Data written to '{filename}'")


def main():
    # Fetch all characters
    raw_characters = fetch_all_characters(API_URL)

    # Process and enrich data
    processed = process_characters(raw_characters)

    # Sort by number of season appearances (descending)
    sorted_characters = sort_by_seasons(processed)

    # Preview top 10
    print("Top 10 characters by number of season appearances:")
    print(f"{'Name':<30} {'Seasons'}")
    print("-" * 40)
    for char in sorted_characters[:10]:
        print(f"{char['Name']:<30} {char['Number of Seasons']}")

    # Write to Excel
    print()
    write_to_excel(sorted_characters)


if __name__ == "__main__":
    main()
