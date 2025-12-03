"""
scrape_statbroadcast_event.py
Scrapes all player stat tables from a single StatBroadcast event page.

Usage:
    pip install playwright bs4 pandas
    playwright install
    python scrape_statbroadcast_event.py
"""

import os
import time
import json
from urllib.parse import urljoin, urlparse
from pathlib import Path
from bs4 import BeautifulSoup
import pandas as pd
from playwright.sync_api import sync_playwright

# Event URL (change if needed)
EVENT_URL = "http://archive.statbroadcast.com/594271.html"

# Output folders
OUTPUT_HTML = Path("output_html")
OUTPUT_JSON = Path("output_json")
OUTPUT_HTML.mkdir(exist_ok=True)
OUTPUT_JSON.mkdir(exist_ok=True)

HEADLESS = True
NAV_TIMEOUT = 30000  # ms
PAUSE_BETWEEN = 1.0  # seconds

def safe_filename_from_url(url: str) -> str:
    parts = urlparse(url)
    fname = parts.path.strip("/").replace("/", "_")
    if parts.query:
        fname += "_" + parts.query.replace("&", "_").replace("=", "-")
    return "".join(c if c.isalnum() or c in "-._" else "_" for c in fname)[:200]

def collect_stat_links(html, base_url):
    """Collect all links that likely contain stats tables."""
    soup = BeautifulSoup(html, "html.parser")
    links = []
    for a in soup.find_all("a", href=True):
        href = a["href"]
        if "statbroadcast.php" in href or "statmonitr.php" in href:
            links.append(urljoin(base_url, href))
    # dedupe while preserving order
    seen = set()
    out = []
    for l in links:
        if l not in seen:
            out.append(l)
            seen.add(l)
    return out

def extract_tables_from_html(html):
    """Use pandas to extract tables as list of dicts."""
    tables_data = []
    try:
        tables = pd.read_html(html)
        for i, df in enumerate(tables, start=1):
            tables_data.append({
                "table_index": i,
                "columns": df.columns.tolist(),
                "rows": df.fillna("").to_dict(orient="records")
            })
    except ValueError:
        # no tables found
        pass
    return tables_data

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=HEADLESS)
        context = browser.new_context()
        page = context.new_page()

        # Step 1: visit event page
        print("Visiting event page:", EVENT_URL)
        page.goto(EVENT_URL, timeout=NAV_TIMEOUT, wait_until="networkidle")
        event_html = page.content()
        event_fname = safe_filename_from_url(EVENT_URL) + ".html"
        (OUTPUT_HTML / event_fname).write_text(event_html, encoding="utf-8")

        # Step 2: collect stat links
        stat_links = collect_stat_links(event_html, EVENT_URL)
        print(f"Found {len(stat_links)} stat links")

        all_results = []
        for i, link in enumerate(stat_links, start=1):
            print(f"[{i}/{len(stat_links)}] Visiting stat page: {link}")
            page.goto(link, timeout=NAV_TIMEOUT, wait_until="networkidle")
            html = page.content()
            fname = safe_filename_from_url(link) + ".html"
            (OUTPUT_HTML / fname).write_text(html, encoding="utf-8")

            # Step 3: extract tables
            tables_data = extract_tables_from_html(html)
            result = {
                "url": link,
                "tables_found": len(tables_data),
                "tables": tables_data
            }
            all_results.append(result)

            time.sleep(PAUSE_BETWEEN)

        # Step 4: save summary JSON
        summary_fname = safe_filename_from_url(EVENT_URL) + "_tables.json"
        with open(OUTPUT_JSON / summary_fname, "w", encoding="utf-8") as f:
            json.dump(all_results, f, indent=2)
        print("Done! Saved HTML and JSON tables to:", OUTPUT_HTML, OUTPUT_JSON)

        browser.close()

if __name__ == "__main__":
    main()