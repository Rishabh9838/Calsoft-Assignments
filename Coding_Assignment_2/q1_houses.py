"""
Q1: Houses of Ice and Fire
- Fetches all houses and regions from the API
- Writes the list to a text file
- Orders all houses alphabetically
"""

import requests

API_URL = "https://anapioficeandfire.com/api/houses"


def fetch_all_houses(url: str) -> list[dict]:
    """Fetch all houses from the API using pagination."""
    houses = []
    page = 1
    page_size = 50  # Max allowed by the API

    print("Fetching houses from API...")
    while True:
        response = requests.get(url, params={"page": page, "pageSize": page_size})
        response.raise_for_status()
        data = response.json()

        if not data:
            break

        houses.extend(data)
        print(f"  Fetched page {page} ({len(data)} houses)")
        page += 1

    print(f"Total houses fetched: {len(houses)}\n")
    return houses


def extract_house_region_list(houses: list[dict]) -> list[tuple[str, str]]:
    """Extract (house_name, region) tuples from raw API data."""
    return [
        (house.get("name", "Unknown"), house.get("region", "Unknown"))
        for house in houses
    ]


def sort_alphabetically(house_region_list: list[tuple[str, str]]) -> list[tuple[str, str]]:
    """Sort the list of (house, region) tuples alphabetically by house name."""
    return sorted(house_region_list, key=lambda x: x[0])


def write_to_text_file(house_region_list: list[tuple[str, str]], filename: str = "houses_and_regions.txt") -> None:
    """Write the house/region list to a formatted text file."""
    with open(filename, "w", encoding="utf-8") as f:
        f.write("Houses and Regions of Ice and Fire\n")
        f.write("=" * 50 + "\n\n")
        f.write(f"{'House Name':<50} {'Region'}\n")
        f.write("-" * 80 + "\n")
        for name, region in house_region_list:
            f.write(f"{name:<50} {region}\n")
    print(f"Data written to '{filename}'")


def main():
    # Fetch all houses
    raw_houses = fetch_all_houses(API_URL)

    # Extract relevant fields
    house_region_list = extract_house_region_list(raw_houses)

    # Sort alphabetically
    sorted_list = sort_alphabetically(house_region_list)

    # Write to text file
    write_to_text_file(sorted_list)

    # Preview first 10 entries
    print("\nFirst 10 houses (alphabetically sorted):")
    print(f"{'House Name':<50} {'Region'}")
    print("-" * 80)
    for name, region in sorted_list[:10]:
        print(f"{name:<50} {region}")


if __name__ == "__main__":
    main()
