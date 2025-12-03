# Breakdown of points and how their calculated

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
[
  {
    "Athlete": "Binford, A",
    "HittingPoints": 48,
    "MVPPoints": 0,
    "PitchingPoints": 14,
    "TotalPoints": 642,
    "WINPoints": 580
  }
]
```

## pitchingstat route

```json
[
  {
    "Athlete": "Binford, A",
    "B": 29,
    "B/AVG": 0.333,
    "BB": 2,
    "CG": 0,
    "ER": 3,
    "ERA": 5.73,
    "G": 3,
    "GS": 0,
    "H": 5,
    "HP": 1,
    "HR": 0,
    "IP": 3.2,
    "L": 1,
    "Points": 14,
    "S": 44,
    "SHO": 0,
    "SO": 4,
    "SV": 0,
    "W-L": 1,
    "WP": 0
  }
]
```

## hittingstat route

```json
[
  {
    "1B": 10,
    "2B": 0,
    "3B": 0,
    "AB": 32,
    "AVG": 0.344,
    "Athlete": "Coffey, D",
    "BB": 6,
    "CS": 0,
    "G": 10,
    "GS": 10,
    "H": 11,
    "HP": 0,
    "HR": 1,
    "OBP": 0.447,
    "OPS": 0.885,
    "PA": 38,
    "Points": 210,
    "R": 8,
    "RBI": 2,
    "SB": 1,
    "SF": 0,
    "SH": 0,
    "SLG%": 0.438,
    "SO": 4,
    "TB": 14
  }
]
```

## win route

```json
[
  {
    "Athlete": "Allchin, J",
    "Game": 280,
    "Games Won": 4,
    "Inning": 220,
    "Innings Won": 22,
    "Total Win": 500
  }
]
```

## mvp route

```json
[
  {
    "1st": 0,
    "2nd": 0,
    "3rd": 0,
    "Athlete": "Andrews, A",
    "D MVP": 0,
    "Times Won - 1": 0,
    "Times Won - 3": 0,
    "Times Won - D": 0,
    "Times Won -2": 0,
    "Total MVP": 0
  }
]
```
