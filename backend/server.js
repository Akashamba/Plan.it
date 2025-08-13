// const express = require("express");
// const app = express();
// const port = 3000;

// app.get("/", (req, res) => {
//   res.json({
//     message: "Hello from server!",
//   });
// });

// app.listen(port, () => {
//   console.log(`App listening on port ${port}`);
// });

// module.exports = app;

const express = require("express");
const app = express();

// app.use(express.static('public'));

app.get("/", function (req, res) {
  res.json({ message: "hello from server!" });
});

app.listen(3000, () => console.log("Server ready on port 3000."));

module.exports = app;
