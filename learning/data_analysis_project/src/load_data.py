import argparse
import os
import pandas as pd


def ensure_dir(path):
    os.makedirs(path, exist_ok=True)


def load_excel_to_csv(input_path, sheet_name=None, out_csv="data/sv.csv"):
    ensure_dir(os.path.dirname(out_csv) or ".")
    df = pd.read_excel(input_path, sheet_name=sheet_name)
    df.to_csv(out_csv, index=False)
    print(f"Loaded {len(df)} rows from '{input_path}' and wrote '{out_csv}'")


def main():
    parser = argparse.ArgumentParser(description="Load sv.xlsx and export to CSV")
    parser.add_argument("--input", default=r"C:\\Users\\PRIYANKA SHARMA\\Downloads\\sv.xlsx",
                        help="Path to sv.xlsx")
    parser.add_argument("--sheet", default=None, help="Sheet name or index (optional)")
    parser.add_argument("--out", default="data/sv.csv", help="Output CSV path")
    args = parser.parse_args()

    if not os.path.exists(args.input):
        print(f"Input file not found: {args.input}")
        return

    load_excel_to_csv(args.input, sheet_name=args.sheet, out_csv=args.out)


if __name__ == "__main__":
    main()
