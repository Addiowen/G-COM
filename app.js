const express = require("express");
const app = express();

// routes
app.get('/', (req,res) => {
    res.send("Placeholder text for sample route");
})

// listner
const port = 3000;
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
})