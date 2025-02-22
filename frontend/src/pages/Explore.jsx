import { useState, useEffect, useRef } from "react";
import "../styles/Explore.css";
import Navbar from "../components/Navbar";
import LikeButton from "../components/LikeButton";

const Explore = () => {
    const [outfits, setOutfits] = useState ([]);
    const [likedOutfits, setLikedOutfits] = useState(new Set());
    const [isLoggedIn, setIsLoggedIn] = useState(true);

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

    const handleLike = async (outfitId) => { //This handles likes based on outfitID
        if (likedOutfits.has(outfitId)) {
            return; // Does nothing if user has already liked this outfit
        }

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
                setLikedOutfits((prevLikedOutfits) => new Set(prevLikedOutfits).add(outfitId));
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
                        <LikeButton
                            liked={likedOutfits.has(outfit.id)}
                            likes={outfit.likes}
                            onClick={() => handleLike(outfit.id)}
                            isLoggedIn={isLoggedIn}
                            />
                    </div>
                ))}
            </div>
        </div>
    </div>


    );
};


export default Explore