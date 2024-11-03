import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Car = (props) => (
    <div className="border-b trasition-colors hover:bg-gray-100">
        <img src={props.car.photos_links[0]}></img>
        <div className="p-2">
            <p>{props.car.full_name}</p> - <b>{props.car.year}</b>
            <h2>{props.car.plate}</h2>
            <a href={car.link}>{car.source}</a>
        </div>
    </div>
);

export default function CarList() {
    const [cars, setCars] = useState([]);

    useEffect(() => {
        (async () => {
            const response = await fetch("http://localhost:5000/api/cars");
            if (!response.ok) {
                const message = `An error occurred: ${response.statusText}`;
                console.error(message);
                return;
            }
            const cars = await response.json();
            setCars(cars);
        })();
        return;
    }, [cars.length]);

    function renderCars() {
        return cars.map((car) => {
            return (
                <Car car={car} />
            );
        });
    }

    return (
        <div className="container mx-auto">
            <h3 className="text-3xl font-semibold p-4">Znalezione pojazdy</h3>
            <div className="flex flex-wrap">
                {renderCars()}
            </div>
        </div>
    );
};