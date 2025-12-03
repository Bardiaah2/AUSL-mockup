#!/usr/bin/env python3
"""
Script to fetch sample data from the Flask backend and generate documentation
"""

import requests
import json
from datetime import datetime

# Backend URL (adjust if needed)
BASE_URL = "http://localhost:5000"

def fetch_data(endpoint):
    """Fetch data from a specific endpoint"""
    try:
        response = requests.get(f"{BASE_URL}{endpoint}")
        response.raise_for_status()
        return response.json()
    except requests.exceptions.ConnectionError:
        print(f"❌ Error: Could not connect to {BASE_URL}. Make sure the Flask backend is running.")
        return None
    except requests.exceptions.RequestException as e:
        print(f"❌ Error fetching {endpoint}: {e}")
        return None

def format_sample_data(data, max_items=1):
    """Format sample data for markdown - show first N items"""
    if not data:
        return "[]"
    
    if isinstance(data, list):
        samples = data[:max_items]
        # Clean up the data to avoid extremely long output
        cleaned_samples = []
        for item in samples:
            if isinstance(item, dict):
                cleaned_item = {}
                for key, value in item.items():
                    # Skip extremely long values
                    if isinstance(value, str) and len(value) > 500:
                        cleaned_item[key] = f"<{len(value)} characters>"
                    else:
                        cleaned_item[key] = value
                cleaned_samples.append(cleaned_item)
            else:
                cleaned_samples.append(item)
        return json.dumps(cleaned_samples, indent=2)
    else:
        return json.dumps(data, indent=2)

def main():
    print("🔄 Fetching sample data from backend...\n")
    
    # Define all endpoints
    endpoints = {
        "points": "/api/points",
        "pitchingstat": "/api/pitchingstats",
        "hittingstat": "/api/hittingstats",
        "win": "/api/win",
        "mvp": "/api/mvp"
    }
    
    all_data = {}
    
    # Fetch all endpoints
    for name, endpoint in endpoints.items():
        print(f"📡 Fetching {name} from {endpoint}...")
        data = fetch_data(endpoint)
        if data is not None:
            all_data[name] = data
            print(f"✅ Successfully fetched {name} ({len(data) if isinstance(data, list) else 1} items)\n")
        else:
            print(f"⏭️  Skipping {name}\n")
    
    # Generate markdown content
    markdown_content = generate_markdown(all_data)
    
    # Save to file
    output_file = "/Users/bardia/Desktop/AUSL-mockup/breakdownInfo.md"
    with open(output_file, "w") as f:
        f.write(markdown_content)
    
    print(f"\n✅ Sample data saved to breakdownInfo.md")
    print(f"📝 Generated at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

def generate_markdown(data):
    """Generate markdown content with sample data"""
    content = """# Breakdown of points and how their calculated

## stat point breakdown

hitting_values = {
    "Single": 10, "Double": 20, "Triple": 30, "Home Run": 40,
    "Stolen Base": 10, "Caught Stealing": -10,
    "Walk": 10, "HBP": 8, "Sacrifice Fly/Bunt": 10
}
pitching_values = {"out": 4, "allowed run": -10}

doc.get("1B", 0) * hitting_values["Single"] +
doc.get("2B", 0) * hitting_values["Double"] +
doc.get("3B", 0) * hitting_values["Triple"] +
doc.get("HR", 0) * hitting_values["Home Run"] +
doc.get("SB", 0) * hitting_values["Stolen Base"] +
doc.get("CS", 0) * hitting_values["Caught Stealing"] +
doc.get("BB", 0) * hitting_values["Walk"] +
doc.get("HP", 0) * hitting_values["HBP"] +
(doc.get("SF", 0) + doc.get("SH", 0)) * hitting_values["Sacrifice Fly/Bunt"]

which means 1B json key that we get from the backend is Single stats and so on
and for the last one Sacrifice Fly/Bunt is a some of SF and SH

## MVP point breakdown

Total MVP points = 1st MVP points + 2nd MVP points + 3rd MVP points + D MVP points

## Win point breakdown

Total Win points = Innings won * 10 + Games won * 70

# Sample data received from the backend (only GET method)

## points route
```json
"""
    
    if "points" in data and data["points"]:
        content += format_sample_data(data["points"], 1)
    else:
        content += "[]"
    
    content += "\n```\n\n## pitchingstat route\n\n```json\n"
    
    if "pitchingstat" in data and data["pitchingstat"]:
        content += format_sample_data(data["pitchingstat"], 1)
    else:
        content += "[]"
    
    content += "\n```\n\n## hittingstat route\n\n```json\n"
    
    if "hittingstat" in data and data["hittingstat"]:
        content += format_sample_data(data["hittingstat"], 1)
    else:
        content += "[]"
    
    content += "\n```\n\n## win route\n\n```json\n"
    
    if "win" in data and data["win"]:
        content += format_sample_data(data["win"], 1)
    else:
        content += "[]"
    
    content += "\n```\n\n## mvp route\n\n```json\n"
    
    if "mvp" in data and data["mvp"]:
        content += format_sample_data(data["mvp"], 1)
    else:
        content += "[]"
    
    content += "\n```\n"
    
    return content

if __name__ == "__main__":
    main()
