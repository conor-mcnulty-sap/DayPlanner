import React, { useEffect, useState } from "react";
import { Card, CardHeader } from "@ui5/webcomponents-react";

const NewsCard = () => {
  const [newsData, setNewsData] = useState([]);

  useEffect(() => {
    fetch("/news.json")
      .then((response) => response.json())
      .then((data) => setNewsData(data));
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
          <img src={news.img} alt="News" />
          <h2>{news.title}</h2>
          <p>{news.content}</p>
        </div>
      ))}
    </Card>
  );
};

export default NewsCard;
