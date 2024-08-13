const sharp = require('sharp');
const axios = require('axios');
const Vibrant = require('node-vibrant');

class ColorController {
  static async extractColors(req, res) {
    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ error: 'Image URL is required' });
    }

    try {
      // logic to fetch the image
      const response = await axios({
        url: imageUrl,
        responseType: 'arraybuffer',
      });

      //logic to convert image to buffer
      const imageBuffer = Buffer.from(response.data, 'binary');

      //I used sharp to resize image for faster processing
      const resizedImageBuffer = await sharp(imageBuffer)
        .resize({ width: 200 }) 
        .toBuffer();

      // Extract the color palette using node-vibrant
      const palette = await Vibrant.from(resizedImageBuffer).getPalette();

      // Convert palette to array of hex colors
      const colorPalette = Object.values(palette).map(swatch => swatch ? swatch.getHex() : null).filter(Boolean);

      res.json({ colorPalette });
    } catch (error) {
      res.status(500).json({ error: 'Failed to extract colors', details: error.message });
    }
  }
}

module.exports = ColorController;