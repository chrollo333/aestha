import React from "react";
import emptyHeartIcon from "/src/assets/icons/fullLikeIcon.png"; 
import fullHeartIcon from "/src/assets/icons/emptyLikeIcon.png"; 

//  Icons made by https://www.flaticon.com/free-icons/twitter-like sonnycandra <3

const LikeButton = ({ liked, likes, onClick, isLoggedIn}) => {
    const handleClick = () => {
        if (isLoggedIn) {
            onClick();
        } else {
            alert("You must be logged in to like an outfit.");
        }
    };

    return (
        <div className="like-button-container">
            <img
                src={liked ? emptyHeartIcon : fullHeartIcon}
                className="like-button-icon" onClick={handleClick}
            />
            <span className="like-counter">{likes}</span>
        </div>
    );
};

export default LikeButton;