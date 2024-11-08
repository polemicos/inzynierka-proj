import React, { useEffect, useState } from 'react';
import CarCard from '../components/CarCard';

const Cars = () => {
    const [cars, setCars] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        // Fetch cars based on the current page
    }, [currentPage]);

    return (
        <div className="container-md">
            <h1>Znalezione pojazdy:</h1>
            <div className="d-flex flex-wrap">
                {cars.map((car, index) => (
                    <CarCard key={index} car={car} />
                ))}
            </div>
            {/* Pagination Controls */}
        </div>
    );
};

export default Cars;
