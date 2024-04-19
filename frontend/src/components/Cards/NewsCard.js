import React from "react";
import { Card, CardHeader } from "@ui5/webcomponents-react";

const NewsCard = () => {
    const sampleNews = [
        { id: "N123", title: 'News Title', content: 'News Content', img: 'https://picsum.photos/100/'},
        { id: "N456", title: 'News Title', content: 'News Content', img: 'https://picsum.photos/100'},
        { id: "N789", title: 'News Title', content: 'News Content', img: 'https://picsum.photos/100'},
    ];

    return (
        <Card
            header={
                <CardHeader
                    titleText="News"
                />
            }
            style={{
                width: "375px",
            }}
        >
            {sampleNews.map((news) => (
                <div key={news.id}>
                    <img src={news.img} alt="News" />
                    <h2>{news.title}</h2>
                    <p>{news.content}</p>
                </div>
            ))}
        </Card>
    );
}

export default NewsCard;