import requests
from bs4 import BeautifulSoup
from dataclasses import dataclass, asdict
from typing import List
import csv


@dataclass
class Car:
    link: str
    full_name: str
    year: int
    mileage_km: str
    gearbox: str
    fuel_type: str
    price_pln: int
    photo_link: str


class OtomotoScraper:
    def __init__(self, car_make: str) -> None:
        self.headers = {
            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) "
            "AppleWebKit/537.11 (KHTML, like Gecko) "
            "Chrome/23.0.1271.64 Safari/537.11",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Charset": "ISO-8859-1,utf-8;q=0.7,*;q=0.3",
            "Accept-Encoding": "none",
            "Accept-Language": "en-US,en;q=0.8",
            "Connection": "keep-alive",
        }
        self.car_make = car_make

        self.website = "https://www.otomoto.pl/osobowe"

    def scrape_pages(self, number_of_pages: int) -> List[Car]:
        cars = []
        for i in range(1, number_of_pages + 1):
            current_website = f"{self.website}/{self.car_make}/?page={i}"
            new_cars = self.scrape_cars_from_current_page(current_website)
            if new_cars:
                cars += new_cars
        return cars

    def scrape_cars_from_current_page(self, current_website: str) -> List[Car]:
        try:
            response = requests.get(current_website, headers=self.headers).text
            soup = BeautifulSoup(response, "html.parser")
            cars = self.extract_cars_from_page(soup)
            return cars
        except Exception as e:
            print(f"Problem with scraping website: {current_website}, reason: {e}")
            return []

    def extract_cars_from_page(self, soup: BeautifulSoup) -> List[Car]:
        offers_table = soup.find("div", {"data-testid": "search-results"})
        cars = offers_table.find_all("article")
        list_of_cars = []
        for car in cars:
            try:
                link = car.find("h1", class_="e1i3khom9 ooa-1ed90th er34gjf0").find("a", href=True).get("href")
                full_name = car.find("h1", class_="e1i3khom9 ooa-1ed90th er34gjf0").find("a", href=True).text.strip()
                year = car.find("dd", attrs={"data-parameter": "year"}).text.strip()
                mileage_km = car.find("dd", attrs={"data-parameter": "mileage"}).text.strip()
                gearbox = car.find("dd", attrs={"data-parameter": "gearbox"}).text.strip()
                fuel_type = car.find("dd", attrs={"data-parameter": "fuel_type"}).text.strip()
                price_pln = car.find("h3", class_="e1i3khom16 ooa-1n2paoq er34gjf0").text.strip()
                photo_link = car.find("img", class_="e17vhtca4 ooa-2zzg2s").get("src")
                list_of_cars.append(
                    Car(
                        link=link,
                        full_name=full_name,
                        year=year,
                        mileage_km=mileage_km,
                        gearbox=gearbox,
                        fuel_type=fuel_type,
                        price_pln=price_pln,
                        photo_link=photo_link
                    )
                )
            except Exception as e:
                print(f"Error msg: {e}")
        return list_of_cars



def write_to_csv(cars: List[Car]) -> None:
    with open("cars.csv", mode="w") as f:
        fieldnames = [
            "link",
            "full_name",
            "year",
            "mileage_km",
            "gearbox",
            "fuel_type",
            "price_pln",
            "photo_link"
        ]
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        for car in cars:
            writer.writerow(asdict(car))


def scrape_otomoto() -> None:
    make = "bmw"
    scraper = OtomotoScraper(make)
    cars = scraper.scrape_pages(3)
    write_to_csv(cars)


if __name__ == "__main__":
    scrape_otomoto()