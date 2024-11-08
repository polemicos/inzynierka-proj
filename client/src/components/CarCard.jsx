import React from 'react';

const CarCard = ({ car }) => (
    <div className="card m-1" style={{ width: '18rem' }}>
        <img src={car.photos_links[0]} className="card-img-top img-fluid" alt="Car Image" />
        <div className="card-body">
            <p className="card-text">
                {car.full_name} - <b>{car.year}</b>
            </p>
            <h2 className="card-text">
                {car.plate ? car.plate : "Nie znaleziono"}
            </h2>
            <p className="card-link">
                <a href={car.link}>Oryginalna oferta</a>
            </p>
        </div>
    </div>
);

export default CarCard;
