<div align="center">
  <img src="./src/logo.svg" alt="<h1>Pallet</h1>" width="40%"/>
</div>

## Build and run

There is no all-in-one package that you can deploy on your server yet.

1. Create a virtual environment and enter it
```
python -m venv .venv
source .venv/bin/activate
```
2. Install the dependencies
```
pip install -r requirements.txt
npm install
```
3. Open 2 terminal windows and run these the program
```
python -m backend.main
npm run start
```
4. Open your browser to [localhost:3000](http://localhost:3000)

## BOM restock check

Open **Tools → BOM Restock Check**, paste a CSV, and select the columns containing
item IDs and required quantities. Pallet combines duplicate item rows and compares
the total required quantity against current item stock, showing the items and
quantities that need restocking before the pick can be completed.

## Data model

Buildings, areas, items, and tags use caller-provided string IDs. Items can be
associated with a building, area, and string slot. Shelves are not part of the
data model.

## Contributing

This project is in very early development. Any contributions are greatly appreciated.

## Credits

- Logo by [@lewolfyt](https://github.com/lewolfyt)
