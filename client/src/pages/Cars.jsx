import React, { useEffect, useState } from 'react';
import CarCard from '../components/CarCard';
import Pagination from '../components/Pagination';

const Cars = () => {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [limit] = useState(15);

    useEffect(() => {
        const fetchCars = async () => {
            try {
                setLoading(true);
                const response = (await fetch(`http://localhost:5000/api/cars`));
                const data = await response.json();
                console.log(data);
                setCars(data.list);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching cars:', error);
                setLoading(false);
            }
        };

        fetchCars();
    }, []);

    if (loading) return <h1>Ładowanie...</h1>;
    let currentCars = cars.slice(0, limit);
    (() => {
        const indexOfLastCar = currentPage * limit;
        const indexOfFirstCar = indexOfLastCar - limit;
        currentCars = cars.slice(indexOfFirstCar, indexOfLastCar);

    })();

    //change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    return (

        <div className="container-md">

            <h1>Znalezione pojazdy:</h1>
            <div className="d-flex flex-wrap">
                {currentCars.map((car, index) => (
                    <CarCard key={index} car={car} />
                ))}
            </div>
            {/* Pagination Controls */}
            <Pagination className="align-self-center" limit={limit} total={cars.length} paginate={paginate} />
        </div>
    );
};

export default Cars;
