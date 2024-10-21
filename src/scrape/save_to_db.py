from pymongo import MongoClient
from typing import List
import os
from dotenv import load_dotenv
from otomoto_scraper import Car, OtomotoScraper  # Import the classes from the other file
load_dotenv()

class MongoDBHandler:
    def __init__(self, uri: str, db_name: str, collection_name: str) -> None:
        # Initialize the MongoDB client with your connection string
        self.client = MongoClient(uri)
        self.db = self.client[db_name]
        self.collection = self.db[collection_name]

    def save_cars(self, cars: List[Car]) -> None:
        # Convert the list of Car objects to a list of dictionaries
        cars_dict = [car.__dict__ for car in cars]
        
        if cars_dict:
            # Insert all cars into the MongoDB collection
            self.collection.insert_many(cars_dict)
            print(f"Inserted {len(cars_dict)} cars into MongoDB")
        else:
            print("No cars to save.")

def scrape_and_save():
    # Initialize the scraper and MongoDB handler
    scraper = OtomotoScraper()

    # Scrape cars from the website
    cars = scraper.scrape_pages(1)  # Scraping the first page only for this example

    # Replace the below string with your MongoDB connection string
    uri = os.getenv("MONGODB_URI")
    db_name = "car_database"         # The database name you want to use
    collection_name = "otomoto_cars" # The collection name where data will be saved

    # Save the scraped cars to MongoDB
    mongodb_handler = MongoDBHandler(uri, db_name, collection_name)
    mongodb_handler.save_cars(cars)

if __name__ == "__main__":
    scrape_and_save()
