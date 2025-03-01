import { useState, useEffect, useRef } from "react";
import "../styles/Explore.css";
import Navbar from "../components/Navbar";
import LikeButton from "../components/LikeButton";

const Explore = ({ isLoggedIn }) => {
    const [outfits, setOutfits] = useState ([]);
    const [likedOutfits, setLikedOutfits] = useState(new Set());
   

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

    const handleLike = async (outfitId) => {
        if (!isLoggedIn) {
            alert("You must be logged in to like outfits.");
            return;
        }
    
        const token = localStorage.getItem("token"); // Get token from local storage
    
        if (!token) {
            alert("You must be logged in to like outfits.");
            return;
        }
    
        if (likedOutfits.has(outfitId)) {
            // Unlike the outfit (DELETE request)
            try {
                const response = await fetch(`http://localhost:5000/api/fashion/outfits/${outfitId}/unlike`, {
                    method: "DELETE", // Use DELETE method as per updated Flask route
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });
    
                if (response.ok) {
                    const data = await response.json();
                    setOutfits((prevOutfits) =>
                        prevOutfits.map((outfit) =>
                            outfit.id === outfitId ? { ...outfit, likes: data.likes } : outfit
                        )
                    );
                    setLikedOutfits((prevLikedOutfits) => {
                        const newLikedOutfits = new Set(prevLikedOutfits);
                        newLikedOutfits.delete(outfitId);
                        return newLikedOutfits;
                    });
                } else {
                    console.error("Error unliking outfit");
                }
            } catch (error) {
                console.error("Failed to unlike outfit:", error);
            }
        } else {
            // Like the outfit (POST request)
            try {
                const response = await fetch(`http://localhost:5000/api/fashion/outfits/${outfitId}/like`, {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });
    
                const data = await response.json();
                if (response.ok) {
                    setOutfits((prevOutfits) =>
                        prevOutfits.map((outfit) =>
                            outfit.id === outfitId ? { ...outfit, likes: data.likes } : outfit
                        )
                    );
                    setLikedOutfits((prevLikedOutfits) => {
                        const newLikedOutfits = new Set(prevLikedOutfits);
                        newLikedOutfits.add(outfitId);
                        return newLikedOutfits;
                    });
                } else {
                    console.error("Error liking outfit");
                }
            } catch (error) {
                console.error("Failed to like outfit:", error);
            }
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