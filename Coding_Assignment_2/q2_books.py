"""
Q2: Books of Ice and Fire
- Reads list of books from the API
- Creates a dictionary of {book_name: [pages, date_of_release, ISBN, publisher]}
- Exports the dictionary to a CSV file
"""

import csv
import requests
from datetime import datetime

API_URL = "https://anapioficeandfire.com/api/books"


def fetch_all_books(url: str) -> list[dict]:
    """Fetch all books from the API using pagination."""
    books = []
    page = 1
    page_size = 50

    print("Fetching books from API...")
    while True:
        response = requests.get(url, params={"page": page, "pageSize": page_size})
        response.raise_for_status()
        data = response.json()

        if not data:
            break

        books.extend(data)
        print(f"  Fetched page {page} ({len(data)} books)")
        page += 1

    print(f"Total books fetched: {len(books)}\n")
    return books


def format_release_date(raw_date: str) -> str:
    """Format ISO date string to a readable date (YYYY-MM-DD)."""
    if not raw_date:
        return "Unknown"
    try:
        dt = datetime.fromisoformat(raw_date.replace("Z", "+00:00"))
        return dt.strftime("%Y-%m-%d")
    except ValueError:
        return raw_date


def build_books_dictionary(books: list[dict]) -> dict[str, list]:
    """Build {book_name: [pages, date_of_release, ISBN, publisher]} dictionary."""
    books_dict = {}
    for book in books:
        name = book.get("name", "Unknown")
        pages = book.get("numberOfPages", 0)
        release_date = format_release_date(book.get("released", ""))
        isbn = book.get("isbn", "Unknown")
        publisher = book.get("publisher", "Unknown")

        books_dict[name] = [pages, release_date, isbn, publisher]

    return books_dict


def write_to_csv(books_dict: dict[str, list], filename: str = "books.csv") -> None:
    """Write the books dictionary to a CSV file."""
    fieldnames = ["Book Name", "Number of Pages", "Date of Release", "ISBN", "Publisher"]

    with open(filename, "w", newline="", encoding="utf-8") as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()

        for book_name, details in books_dict.items():
            pages, date_of_release, isbn, publisher = details
            writer.writerow({
                "Book Name": book_name,
                "Number of Pages": pages,
                "Date of Release": date_of_release,
                "ISBN": isbn,
                "Publisher": publisher,
            })

    print(f"Data written to '{filename}'")


def main():
    # Fetch all books
    raw_books = fetch_all_books(API_URL)

    # Build dictionary
    books_dict = build_books_dictionary(raw_books)

    # Print dictionary preview
    print("Books Dictionary:")
    for name, details in books_dict.items():
        print(f"  {name}: {details}")

    # Write to CSV
    print()
    write_to_csv(books_dict)


if __name__ == "__main__":
    main()
