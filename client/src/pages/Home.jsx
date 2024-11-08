import React from 'react';
import PlateSVG from '../plate.svg'; // adjust the path based on your file location

const Home = () => {
    return (
        <div className="container-md">
            <h1>Strona główna</h1>
            <div className="license-plate-wrapper">
                <div className="license-plate-svg-wrapper mt-6 text-center ">
                    <p>Podaj numer rejestracyjny pojazdu:</p>
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
                            margin: "0.8rem 6rem",
                            fontSize: "34px",
                            font: "bold",
                            textAlign: "center",
                        }}
                        size="8"
                    />
                </div>
            </div>
        </div >
    );
};

export default Home;
