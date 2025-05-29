const express = require('express');
const cors = require('cors');
const crypto = require('crypto');

const app = express();
app.use(cors());
app.use(express.json());

const CLOUDINARY_API_KEY = '965428677579295';
const CLOUDINARY_API_SECRET = 'H5W2TLuwR5NcV7gOfS6hdNjy688';
const CLOUDINARY_CLOUD_NAME = 'ecologis';

app.post('/sign-upload', (req, res) => {
  const { public_id, folder } = req.body;
  const timestamp = Math.floor(Date.now() / 1000);

  let paramsToSign = [
    `folder=${folder}`,
    `public_id=${public_id}`,
    `timestamp=${timestamp}`
  ].join('&');

  const signatureString = paramsToSign + CLOUDINARY_API_SECRET;
  const signature = crypto
    .createHash('sha1')
    .update(signatureString)
    .digest('hex');

  res.json({
    signature,
    apiKey: CLOUDINARY_API_KEY,
    cloudName: CLOUDINARY_CLOUD_NAME,
    timestamp,
    folder,
    public_id,
    resource_type: 'raw'
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Cloudinary sign server running on port ${PORT}`);
}); 