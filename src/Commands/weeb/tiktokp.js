const porntik = require('../../lib/tiktokPorn')
const axios = require("axios")
const os = require('os');
const path = require('path');
const fs = require('fs/promises');

module.exports = {
    name: 'tiktits',
    aliases: ['tiktokp' , 'tt'],
    category: 'weeb',
    exp: 10,
    description: 'Sends an image of random neko',
    async execute(client, arg, M) {
        try {
            const numVideosToDownload = 5; // Specify the number of videos to download
            const videoDirectory = 'videos'; // Specify the directory to save the videos
      
            // Create the videos directory if it doesn't exist
            if (!fs.existsSync(videoDirectory)) {
              fs.mkdirSync(videoDirectory);
            }
      
            for (let i = 0; i < numVideosToDownload; i++) {
              const url = await scrapeWebsite();
      
              if (!url) {
                console.log('No URL found');
                continue;
              }
      
              const response = await axios.get(url, { responseType: 'stream' });
      
              // Generate a unique filename for each video
              const videoFilename = `video_${i + 1}.mp4`;
              const videoPath = path.join(videoDirectory, videoFilename);
      
              const videoStream = response.data.pipe(fs.createWriteStream(videoPath));
              await new Promise((resolve, reject) => {
                videoStream.on('finish', resolve);
                videoStream.on('error', reject);
              });
      
              console.log(`Downloaded video ${i + 1}: ${videoPath}`);
            }
      
            console.log('Videos downloaded successfully');
          } catch (error) {
            console.error('Error:', error);
          }
        }
      };