import React, { useEffect, useState } from "react";
import { Card, CardHeader } from "@ui5/webcomponents-react";

const NewsCard = () => {
  const [newsData, setNewsData] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/news`)
      .then((response) => response.json())
      .then((data) => {
        const articles = data["Articles"];
        setNewsData(articles);
      })
      .catch((error) => console.error("Error:", error));
  }, []);

  return (
    <Card
      header={<CardHeader titleText="News" />}
      style={{
        width: "100%",
        maxHeight: "50vh",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "1rem",
          margin: "1rem",
        }}
      >
        {newsData.map((news) => (
          <a href={news.link} key={news.id} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div>
              <img src={news.image} alt="News" style={{ width: "100%" }} />
              <h2>{news.title}</h2>
              <p>{news.author}</p>
            </div>
          </a>
        ))}
      </div>
    </Card>
  );
};

export default NewsCard;