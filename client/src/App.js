import React, {useEffect, useState} from 'react'

function App() {

  const [backendData, setBackendData] = useState([{}])
  useEffect(() => { 
    fetch('/api/news').then(
      response => response.json()
    ).then(data => {
      setBackendData(data)
    })
  }
  , [])


  return (
    <div>
      <h1>Hello World</h1>
      <h2>Atricles</h2>
      <ul>
        {backendData.Articles && backendData.Articles.map((article, index) => (
          <li key={index}>
            <a href={article.link
            }>{article.title}</a>
            <p>Author: {article.author}</p>
            <p>Date: {article.date}</p>
            <img src={article.image} alt="article image" />
          </li>
        ))}
      </ul>
      <h2>Blog Posts</h2>
      <ul>
        {backendData.BlogPosts && backendData.BlogPosts.map((blogPost, index) => (
          <li key={index}>
            <a href={blogPost.link}>{blogPost.title}</a>
            <p>Author: {blogPost.author}</p>
            <p>Date: {blogPost.date}</p>
            <img src={blogPost.image} alt="blog post image" />
            <p>{blogPost.excerpt}</p>
          </li>
        ))}
      </ul>
      <h2>SAP News</h2>
      <ul>
        {backendData["SAP News"] && backendData["SAP News"].map((news, index) => (
          <li key={index}>
            <a href={news.link}>{news.title}</a>
          </li>
        ))}
      </ul>
    </div>


  )
}
export default App