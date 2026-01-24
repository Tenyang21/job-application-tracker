const express = require("express");
const app = express();
const port = 3000;

app.listen(port, () => {
    console.log(`Sever running at http://localhost:${port}`);
});
