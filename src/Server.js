const app = require('./App');
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// // Start the server
// app.listen(5000, () => {
//   console.log('Server is running on http://localhost:5000');
// });
