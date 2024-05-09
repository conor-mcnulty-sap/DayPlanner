import React, { useEffect, useState } from "react";
import { Card, CardHeader } from "@ui5/webcomponents-react";

const NewsCard = () => {
  const [newsData, setNewsData] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/news`)
  .then(response => response.json())
  .then(data => {
    const articles = data['Articles'];
    setNewsData(articles);
  })
  .catch(error => console.error('Error:', error));
  }, []);

  return (
    <Card
      header={<CardHeader titleText="News" />}
      style={{
        width: "375px",
      }}
    >
      {newsData.map((news) => (
        <div key={news.id}>
          <img src={news.image} alt="News" />
          <h2>{news.title}</h2>
          <p>{news.author}</p>
        </div>
      ))}
    </Card>
  );
};

export default NewsCard;
