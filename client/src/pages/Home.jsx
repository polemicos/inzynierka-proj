import React, { useState } from 'react';
import PlateSVG from '../plate.svg'; // adjust the path based on your file location
import CarCard from '../components/CarCard';
import Pagination from '../components/Pagination';

const renderReceivedData = (receivedData) => {
    if (receivedData) {
        return (
            <div className="container-md mt-5">
                <h1>Znalezione pojazdy:</h1>
                <div className="d-flex flex-wrap">
                    {receivedData.map((car, index) => (
                        <CarCard key={index} car={car} />
                    ))}
                </div>
                {/* Pagination Controls */}
                <Pagination className="align-self-center" limit={10} total={receivedData.length} paginate={() => { }} />
            </div>
        );
    }
    return null;
}

const Home = () => {
    const [receivedData, setReceivedData] = useState(null); // Use state to track received data

    const search = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const searched = formData.get('searched');
        let data = null;

        try {
            if (formData.get('searchType') === 'searchPlate') {
                const response = await fetch(`http://localhost:5000/api/search/plate/${searched}`);
                data = await response.json();
            } else if (formData.get('searchType') === 'searchBrand') {
                const response = await fetch(`http://localhost:5000/api/search/brand/${searched}`);
                data = await response.json();
            }
            setReceivedData(data); // Update state with the received data
        } catch (error) {
            console.error('Error fetching data:', error);
            setReceivedData(null); // Clear data in case of error
        }
    };

    return (
        <div className="container-md text-center">
            <h1>Strona główna</h1>
            <div className="license-plate-wrapper">
                <div className="license-plate-svg-wrapper mt-6 text-center">
                    <p>Podaj numer rejestracyjny pojazdu/markę pojazdu:</p>
                    <form style={{ display: 'flex', flexDirection: 'column', justifyItems: 'center', alignItems: 'center' }} onSubmit={search}>
                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'end' }}>
                            <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <img src={PlateSVG} alt="Polish License Plate" className="license-plate-image" style={{ zIndex: 0, position: 'absolute' }} />
                                <input
                                    type="text"
                                    maxLength="8"
                                    placeholder="SR4657C"
                                    className="license-plate-input"
                                    style={{
                                        outline: 'none',
                                        border: 'none',
                                        zIndex: 1,
                                        position: 'relative',
                                        fontSize: "34px",
                                        textAlign: "center",
                                        width: "17rem"
                                    }}
                                    size="8"
                                    id='searched'
                                    name="searched"
                                />
                            </div>

                            <div className="radio-group mt-3" style={{ display: 'flex', flexDirection: 'column', marginLeft: '4rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <input type="radio" name="searchType" id="searchPlate" value="searchPlate" />
                                    <label htmlFor="searchPlate" style={{ marginLeft: '0.5rem' }}>Szukaj po numerze rejestracyjnym</label>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', marginTop: '0.5rem' }}>
                                    <input type="radio" name="searchType" id="searchBrand" value="searchBrand" />
                                    <label htmlFor="searchBrand" style={{ marginLeft: '0.5rem' }}>Szukaj po marce</label>
                                </div>
                            </div>
                        </div>
                        <button className="btn btn-primary w-40" style={{ marginTop: '2rem' }} type='submit'>Szukaj</button>
                    </form>
                </div>
            </div>
            {renderReceivedData(receivedData)}
        </div>
    );
};

export default Home;
