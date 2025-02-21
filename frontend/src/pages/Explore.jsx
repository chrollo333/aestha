import { useState, useEffect, useRef } from "react";
import "../styles/Explore.css";
import { motion, useScroll, useTransform } from "framer-motion";
import Navbar from "../components/Navbar";


const Explore = () => {
    const [outfits, setOutfits] = useState ([]);


    useEffect(() => {
        const fetchOutfits = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/fashion/outfits");
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                console.log("Fetched outfits:", data); //Debugging test to see what data got fetched
                setOutfits(data);
            } catch (error) {
                console.error("Failed fetching outfits:", error); //If fetching outfit data fails, this will report an error
            }
        };

        fetchOutfits();
    }, []);

    const handleLike = async (outfitId) => { //This function handles likes based on outfitID
        try {
            const response = await fetch(`http://localhost:5000/api/fashion/outfits/${outfitId}/like`, {
                method: "POST",
            });
            const data = await response.json();
            if (response.ok) {
                setOutfits((prevOutfits) =>
                    prevOutfits.map((outfit) =>
                        outfit.id === outfitId ? { ...outfit, likes: data.likes} : outfit
                    )
                );
            } else {
                console.error("Error liking outfit", data.error);
            }
        } catch (error) {
            console.error("Failed liking outfit:", error);
        }
    };
return ( 
    <div>
        <div className="page-container">
            <Navbar />
            <div className="outfit-grid">
                {outfits.map((outfit) => (
                    <div key={outfit.id} className="outfit-item">
                        <img src={outfit.image_url} alt={outfit.source} />
                        <button onClick={() => handleLike(outfit.id)}>Like ({outfit.likes})</button>
                    </div>
                ))}
            </div>
        </div>
    </div>


    );
};


export default Explore