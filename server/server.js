const express = require('express'); 
const app = express();

app.get('/api/news', (req, res) => {
    //res.json({"Users": ["Alice", "Bob", "Charlie"]});
    
    res.sendFile('output.json', { root: __dirname });
    }
);



app.listen(5000, () => {
    console.log('Server is running on port 5000');
});