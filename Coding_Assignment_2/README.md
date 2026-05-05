# Ice and Fire API – Python Coding Assignment

## Overview

This project contains three Python scripts that interact with the
[An API of Ice and Fire](https://anapioficeandfire.com/) to fetch, process,
and export data about houses, books, and characters from the Game of Thrones
universe.

---

## Tech Stack

| Tool / Library | Purpose |
|---|---|
| Python 3.10+ | Core language |
| `requests` | HTTP API calls with pagination |
| `csv` (stdlib) | Writing CSV files |
| `openpyxl` | Creating and styling Excel (.xlsx) files |
| `datetime` (stdlib) | Parsing and formatting ISO date strings |

---

## Project Structure

```
.
├── q1_houses.py          # Q1 – Houses and Regions
├── q2_books.py           # Q2 – Books dictionary + CSV export
├── q3_characters.py      # Q3 – Characters sorted by TV season appearances + Excel
└── README.md
```

**Generated output files (created on run):**

```
houses_and_regions.txt    # Q1 output
books.csv                 # Q2 output
characters.xlsx           # Q3 output
```

---

## Installation

```bash
pip install requests openpyxl
```

---

## Usage

Run each script individually from the project root:

```bash
python q1_houses.py
python q2_books.py
python q3_characters.py
```

---

## Script Details

### Q1 – `q1_houses.py`
- **API:** `https://anapioficeandfire.com/api/houses`
- Fetches all houses using pagination (50 per page)
- Extracts **house name** and **region** for each house
- Sorts all houses **alphabetically by name**
- Writes the sorted list to **`houses_and_regions.txt`**

### Q2 – `q2_books.py`
- **API:** `https://anapioficeandfire.com/api/books`
- Fetches all books from the API
- Builds a dictionary: `{book_name: [pages, date_of_release, ISBN, publisher]}`
- Exports the dictionary to **`books.csv`** with labelled columns

### Q3 – `q3_characters.py`
- **API:** `https://anapioficeandfire.com/api/characters`
- Fetches all characters using pagination
- Parses each character's `tvSeries` field to count unique season appearances
- Sorts characters **descending** by number of season appearances
- Exports all available character data to a formatted **`characters.xlsx`** file
  with styled headers, alternating row colours, auto-sized columns, and a
  frozen header row

---

## Notes

- All scripts handle API pagination automatically.
- The API is public and does not require authentication.
- Characters with no TV series appearances are included at the bottom of the
  Excel file (0 seasons).
- Date values from the API (ISO 8601 format) are formatted as `YYYY-MM-DD` in
  the output files.
