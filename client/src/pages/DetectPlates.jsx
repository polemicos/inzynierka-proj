import React, { useState } from "react";

const DetectPlates = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [detectedPlates, setDetectedPlates] = useState(null);
    const detectPlates = async () => {
        if (!selectedImage) return;

        try {
            // Create a new FormData object to handle the file upload
            const formData = new FormData();
            formData.append("img", selectedImage); // Append the image file with a key that the backend expects, like 'file'.

            // Send the formData with the image file in the request body
            const response = await fetch("http://localhost:5000/api/detect", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Parse the response as JSON
            const data = await response.json();
            setDetectedPlates(data);
        } catch (error) {
            console.error("Error detecting plates:", error);
        }
    };

    return (
        <div>
            <h1>Skanuj swoje zdjecia</h1>

            {selectedImage && (
                <div>
                    <img
                        alt="Not Found"
                        width={"500em"}
                        src={URL.createObjectURL(selectedImage)}
                    />
                </div>
            )}

            <br />
            <form
                className="input-group mb-3 col-12 col-md-6"
                onSubmit={(e) => e.preventDefault()}
            >
                <input
                    type="file"
                    className="form-control"
                    name="userImage"
                    required
                    onChange={(event) => {
                        console.log(event.target.files[0]);
                        setSelectedImage(event.target.files[0]);
                    }}
                />
                <button
                    className="btn btn-primary"
                    type="button"
                    onClick={detectPlates}>Skanuj</button>
            </form>

            {detectedPlates && (
                <div>
                    {detectedPlates.map((plate, index) => (
                        <div key={index}>
                            <p>{plate}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DetectPlates;
