import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import styles from "../styles/News.module.css"

const News = () => {
    const [articles, setArticles] = useState([]);

    const fetchNews = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/news"); // Fetch news from the backend
    
            if (!response.ok) {  
                throw new Error(`HTTP error! status: ${response.status}`); 
            }
    
            const data = await response.json(); // Convert response to JSON
            setArticles(data || []); // Update state, fallback to an empty array if data is null
    
        } catch (error) {
            console.error("Failed fetching news:", error); // Handle errors properly
        }
    };


    useEffect(() => {
        fetchNews(); // Calls the function when the component mounts
    }, []);


    return (
        <div className={styles.newsGrid}>
            {articles.length > 0 ? (
                articles.map((article, index) => (
                    <div key={index} className={styles.newsCard}>
                        <a href={article.url} target="_blank" rel="noopener noreferrer">
                            <h3>{article.title}</h3>
                        </a>
                        <p dangerouslySetInnerHTML={{ __html: article.description }}></p>
                        <a href={article.url} target="_blank" rel="noopener noreferrer">
                        {article.image  && <img  src={article.image} alt={article.title} />}
                        </a>
                    </div>
                ))
            ) : (
                <p>Loading...</p>
            )}
        <Navbar />
        </div>
    );

}

export default News;
