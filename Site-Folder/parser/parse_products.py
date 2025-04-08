# -*- coding: windows-1251 -*-
import csv
import json

input_file = "TSGoods.trs"
output_file = "products.json"

# Мапа: індекси колонок, які нас цікавлять (рахуємо з 0)
PRODUCT_FIELDS = {
    "name": 1,
    "country": 2,
    "sku": 3,
    "price": 4,
    "description": 11,
    "category": 14,
    "manufacturer": 35,
    "barcode": 15
}

products = []

with open(input_file, encoding="windows-1251") as csvfile:
    reader = csv.reader(csvfile, delimiter=';')
    for row in reader:
        if len(row) < max(PRODUCT_FIELDS.values()) + 1:
            continue  # пропустити неповні рядки

        product = {key: row[idx] for key, idx in PRODUCT_FIELDS.items()}
        products.append(product)

# Зберігаємо у JSON
with open(output_file, "w", encoding="utf-8") as jsonfile:
    json.dump(products, jsonfile, ensure_ascii=False, indent=2)

print(f"✅ Збережено {len(products)} товарів у {output_file}")