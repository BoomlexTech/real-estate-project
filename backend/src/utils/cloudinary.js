const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function getPublicId(url) {
  const i = url.indexOf('/upload/');
  if (i === -1) return null;
  return url.slice(i + 8).replace(/^v\d+\//, '').replace(/\.[^/.]+$/, '');
}

async function deleteImages(urls = []) {
  const ids = urls.map(getPublicId).filter(Boolean);
  if (!ids.length) return;
  await Promise.all(ids.map((id) => cloudinary.uploader.destroy(id)));
}

module.exports = { deleteImages };
