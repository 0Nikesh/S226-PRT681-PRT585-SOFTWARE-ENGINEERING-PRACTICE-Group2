import pandas as pd


# ==========================================
# 1. FILE PATHS
# ==========================================

input_file = "database/raw/Tourist_Destinations.csv"

output_file = (
    "database/Cleaned/Australian_Tourist_Destinations.csv"
)


# ==========================================
# 2. LOAD DATA
# ==========================================

df = pd.read_csv(input_file)

print("Original number of records:", len(df))


# ==========================================
# 3. REMOVE EMPTY ROWS
# ==========================================

df = df.dropna(how="all")


# ==========================================
# 4. REMOVE EXACT DUPLICATES
# ==========================================

df = df.drop_duplicates()


# ==========================================
# 5. CLEAN TEXT DATA
# ==========================================

text_columns = [
    "Destination Name",
    "Country",
    "Continent",
    "Type",
    "Best Season",
    "UNESCO Site"
]

for column in text_columns:
    df[column] = (
        df[column]
        .astype(str)
        .str.strip()
    )


# ==========================================
# 6. CONVERT NUMERIC COLUMNS
# ==========================================

df["Avg Cost (USD/day)"] = pd.to_numeric(
    df["Avg Cost (USD/day)"],
    errors="coerce"
)

df["Avg Rating"] = pd.to_numeric(
    df["Avg Rating"],
    errors="coerce"
)

df["Annual Visitors (M)"] = pd.to_numeric(
    df["Annual Visitors (M)"],
    errors="coerce"
)


# ==========================================
# 7. SELECT AUSTRALIA
# ==========================================

df = df[
    df["Country"]
    .str.lower()
    .eq("australia")
]


# ==========================================
# 8. REMOVE INVALID RATINGS
# ==========================================

df = df[
    (df["Avg Rating"] >= 0) &
    (df["Avg Rating"] <= 5)
]


# ==========================================
# 9. REMOVE INVALID COSTS
# ==========================================

df = df[
    df["Avg Cost (USD/day)"] >= 0
]


# ==========================================
# 10. REMOVE INVALID VISITOR VALUES
# ==========================================

df = df[
    df["Annual Visitors (M)"] >= 0
]


# ==========================================
# 11. CONVERT UNESCO YES/NO TO 1/0
# ==========================================

df["UNESCO Site"] = (
    df["UNESCO Site"]
    .str.lower()
    .map({
        "yes": 1,
        "no": 0
    })
)


# ==========================================
# 12. CHECK MISSING VALUES AFTER CLEANING
# ==========================================

print("\nMissing values after cleaning:")

print(df.isnull().sum())


# ==========================================
# 13. DISPLAY FINAL RECORD COUNT
# ==========================================

print("\nFinal Australian records:", len(df))


# ==========================================
# 14. DISPLAY SAMPLE
# ==========================================

print("\nSample of cleaned data:")

print(df.head(10))


# ==========================================
# 15. SAVE CLEANED DATA
# ==========================================

df.to_csv(
    output_file,
    index=False
)

print("\n===================================")
print("CLEANING COMPLETE")
print("===================================")

print("Cleaned file saved to:")

print(output_file)