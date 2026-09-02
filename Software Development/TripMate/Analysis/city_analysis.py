import pandas as pd

# ==========================================
# 1. LOAD DATASET
# ==========================================

file_path = "database/raw/Tourist_Destinations.csv"

df = pd.read_csv(file_path)


# ==========================================
# 2. BASIC DATASET INFORMATION
# ==========================================

print("===================================")
print("DATASET INFORMATION")
print("===================================")

print("Number of rows:", len(df))
print("Number of columns:", len(df.columns))


# ==========================================
# 3. COLUMN NAMES
# ==========================================

print("\nColumn names:")

for column in df.columns:
    print("-", column)


# ==========================================
# 4. FIRST 5 RECORDS
# ==========================================

print("\nFirst 5 records:")
print(df.head())


# ==========================================
# 5. DATA TYPES
# ==========================================

print("\nData types:")
print(df.dtypes)


# ==========================================
# 6. MISSING VALUES
# ==========================================

print("\nMissing values:")
print(df.isnull().sum())


# ==========================================
# 7. DUPLICATE RECORDS
# ==========================================

print("\nDuplicate rows:")
print(df.duplicated().sum())


# ==========================================
# 8. UNIQUE VALUES
# ==========================================

print("\nUnique values:")

for column in df.columns:
    print(column, ":", df[column].nunique())


# ==========================================
# 9. BASIC STATISTICS
# ==========================================

print("\nNumerical statistics:")
print(
    df[
        [
            "Avg Cost (USD/day)",
            "Avg Rating",
            "Annual Visitors (M)"
        ]
    ].describe()
)


# ==========================================
# 10. COUNTRIES
# ==========================================

print("\nNumber of destinations by country:")

print(
    df["Country"]
    .value_counts()
    .head(20)
)


# ==========================================
# 11. DESTINATION TYPES
# ==========================================

print("\nDestination types:")

print(
    df["Type"]
    .value_counts()
)


# ==========================================
# 12. BEST SEASONS
# ==========================================

print("\nBest seasons:")

print(
    df["Best Season"]
    .value_counts()
)


# ==========================================
# 13. UNESCO SITES
# ==========================================

print("\nUNESCO sites:")

print(
    df["UNESCO Site"]
    .value_counts()
)


# ==========================================
# 14. TOP RATED DESTINATIONS
# ==========================================

print("\nTop 10 rated destinations:")

print(
    df[
        [
            "Destination Name",
            "Country",
            "Type",
            "Avg Rating"
        ]
    ]
    .sort_values(
        "Avg Rating",
        ascending=False
    )
    .head(10)
)


# ==========================================
# 15. CHEAPEST DESTINATIONS
# ==========================================

print("\n10 cheapest destinations:")

print(
    df[
        [
            "Destination Name",
            "Country",
            "Avg Cost (USD/day)"
        ]
    ]
    .sort_values(
        "Avg Cost (USD/day)"
    )
    .head(10)
)


# ==========================================
# 16. MOST EXPENSIVE DESTINATIONS
# ==========================================

print("\n10 most expensive destinations:")

print(
    df[
        [
            "Destination Name",
            "Country",
            "Avg Cost (USD/day)"
        ]
    ]
    .sort_values(
        "Avg Cost (USD/day)",
        ascending=False
    )
    .head(10)
)