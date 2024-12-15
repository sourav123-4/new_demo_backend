const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.get('/',(req,res)=>{
  res.json("welcome to this page")
})

app.use('/api/users', userRoutes);

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

module.exports = app;



// const express = require('express');
// const multer = require('multer');
// const ffmpeg = require('fluent-ffmpeg');
// const fs = require('fs');
// const path = require('path');

// // Create folders if they don't exist
// if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');
// if (!fs.existsSync('converted')) fs.mkdirSync('converted');

// // Multer configuration for file uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/'); // Save uploaded files in the "uploads" directory
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`); // Rename file with timestamp
//   },
// });
// const upload = multer({ storage });

// // API to upload audio and convert it
// app.post('/upload', upload.single('audio'), (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ message: 'No audio file uploaded' });
//   }
//   console.log("req.file",req.file);

//   const inputPath = req.file.path; // Path of the uploaded audio file
//   const outputFileName = `converted-${Date.now()}-${req.file.originalname}`;
//   const outputPath = path.join('converted', outputFileName);

//   // Use FFmpeg to convert the audio file
//   ffmpeg(inputPath)
//   .audioFilters('rubberband=pitch=3.0,atempo=1.0,loudnorm')
//   .audioCodec('libmp3lame') // Output format as MP3
//   .audioBitrate('128k') // Maintain good quality
//     .save(outputPath)
//     .on('stderr', (stderrLine) => {
//       console.log('FFmpeg Log:', stderrLine); // Print FFmpeg logs
//     })
//     .on('end', () => {
//       console.log('Conversion complete:', outputPath);
//       res.status(200).json({
//         message: 'Audio uploaded and converted successfully',
//         convertedFile: `http://localhost:5000/converted/${path.basename(outputPath)}`,
//       });
//     })
//     .on('error', (err) => {
//       console.error('Conversion error:', err.message);
//       res.status(500).json({ message: 'Audio conversion failed', error: err.message });
//     });
// });

// // Serve converted files
// app.get('/converted/:filename', (req, res) => {
//   const filePath = path.join(__dirname, 'converted', req.params.filename);
//   if (fs.existsSync(filePath)) {
//     res.sendFile(filePath);
//   } else {
//     res.status(404).send('File not found');
//   }
// });

// // API to list all audio files
// app.get('/audios', (req, res) => {
//   const originalFiles = fs.readdirSync('uploads').map((file) => ({
//     name: file,
//     url: `http://localhost:5000/uploads/${file}`,
//   }));
//   const convertedFiles = fs.readdirSync('converted').map((file) => ({
//     name: file,
//     url: `http://localhost:5000/converted/${file}`,
//   }));

//   res.status(200).json({
//     originalFiles,
//     convertedFiles,
//   });
// });

// // Serve static files (uploaded and converted audio files)
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// app.use('/converted', express.static(path.join(__dirname, 'converted')));

// // // Start the server
// // const PORT = 5000;
// // app.listen(PORT, () => {
// //   console.log(`Server running on http://localhost:${PORT}`);
// // });


// module.exports = app;