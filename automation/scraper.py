import json
from bs4 import BeautifulSoup
import os

# Paths define karte hain
base_dir = os.path.dirname(os.path.abspath(__file__))
html_file_path = os.path.join(base_dir, "myshop.html")
json_file_path = os.path.join(base_dir, "../data/products.json")

def run_scraper():
    print("🕵️‍♂️  Scraper started... Website read kar raha hoon.")

    # 1. HTML File ko padho (Jaise requests.get() karta hai)
    with open(html_file_path, "r", encoding="utf-8") as f:
        html_content = f.read()

    # 2. BeautifulSoup ka jaadoo (Parse HTML)
    soup = BeautifulSoup(html_content, "html.parser")
    
    extracted_data = []
    
    # 3. Har 'product-card' ko dhundo
    products = soup.find_all("div", class_="product-card")

    for item in products:
        # Data extract karna
        name = item.find("h2", class_="title").text
        price = item.find("span", class_="price").text
        desc = item.find("p", class_="desc").text
        stock = item.find("div", class_="status").text
        
        # Dictionary banana
        product_obj = {
            "name": name,
            "price": price,
            "description": desc,
            "stock": stock
        }
        extracted_data.append(product_obj)

    # 4. JSON file mein save kar do
    with open(json_file_path, "w") as json_file:
        json.dump(extracted_data, json_file, indent=4)

    print(f"✅ Success! {len(extracted_data)} products extracted aur 'data/products.json' mein save ho gaye.")

if __name__ == "__main__":
    run_scraper()