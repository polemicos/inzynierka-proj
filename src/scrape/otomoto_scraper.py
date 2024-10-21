import requests
from bs4 import BeautifulSoup
from dataclasses import dataclass
from typing import List
import time
import random

@dataclass
class Car:
    link: str
    full_name: str
    year: str
    photos_links: List[str]
    plate: str = ""

class OtomotoScraper:
    def __init__(self) -> None:
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "en-US,en;q=0.5",
            "Connection": "keep-alive",
        }
        self.website = "https://www.otomoto.pl/osobowe"
        self.session = requests.Session()  # Create a session to persist headers/cookies

    def scrape_pages(self, number_of_pages: int) -> List[Car]:
        cars = []
        for i in range(1, number_of_pages + 1):
            current_website = f"{self.website}/?page={i}"
            new_cars = self.scrape_cars_from_current_page(current_website)
            if new_cars:
                cars += new_cars
        return cars

    def scrape_cars_from_current_page(self, current_website: str) -> List[Car]:
        try:
            response = self.session.get(current_website, headers=self.headers)
            if response.status_code == 403:
                raise Exception("403 Forbidden - Access denied to page")

            soup = BeautifulSoup(response.text, "html.parser")
            cars = self.extract_cars_from_page(soup)
            return cars
        except Exception as e:
            print(f"Problem with scraping website: {current_website}, reason: {e}")
            return []

    def extract_cars_from_page(self, soup: BeautifulSoup) -> List[Car]:
        offers_table = soup.find("div", {'data-testid': "search-results"})
        cars = offers_table.find_all("article")
        list_of_cars = []
        for car in cars:
            try:
                link_tag = car.find("h1").find("a", href=True)
                link = link_tag.get("href")
                full_name = link_tag.get_text(strip=True)
                year_tag = car.find("dd", {'data-parameter': 'year'})
                year = year_tag.get_text(strip=True) if year_tag else "Unknown"
                
                # Extract photos from the offer page
                photos_links = self.extract_photos_from_offer_page(link)

                list_of_cars.append(
                    Car(
                        link=link,
                        full_name=full_name,
                        year=year,
                        photos_links=photos_links,
                    )
                )
            except Exception as e:
                print(f"Error msg: {e}")
        return list_of_cars

    def extract_photos_from_offer_page(self, offer_url: str) -> List[str]:
        
        try:
            retries = 3
            for attempt in range(retries):
                response = self.session.get(offer_url, headers=self.headers)
                
                if response.status_code == 200:
                    soup = BeautifulSoup(response.content, 'html.parser')

                    photo_divs = soup.find_all("div", {"data-testid": "photo-gallery-item"})

                    photo_urls = []
                    for photo_div in photo_divs:
                        img_tag = photo_div.find("img")
                        if img_tag:
                            url = img_tag.get("src")
                            photo_urls.append(url)

                    return photo_urls
                
                elif response.status_code == 403:
                    print(f"Attempt {attempt+1}/{retries} - 403 Forbidden: Retrying after delay...")
                    time.sleep(2 ** attempt)  # Exponential backoff
                else:
                    print(f"Failed to retrieve page, status code: {response.status_code}")
                    return []
            
            print(f"Failed to access offer page: {offer_url} after {retries} retries")
            return []

        except Exception as e:
            print(f"Error: {e}")
            return []

def scrape_otomoto() -> None:
    scraper = OtomotoScraper()
    cars = scraper.scrape_pages(1)
    for car in cars:
        print(car)

if __name__ == "__main__":
    scrape_otomoto()
