require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Property = require('../models/Property');
const Developer = require('../models/Developer');
const Agent = require('../models/Agent');
const BlogPost = require('../models/BlogPost');

const DUBAI_IMGS = [
    'https://images.pexels.com/photos/30707660/pexels-photo-30707660.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',  // Luxury Dubai Apartment Complex with Pool View
    'https://images.pexels.com/photos/34188580/pexels-photo-34188580.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',  // Modern Villa in Dubai Residential Area
    'https://images.pexels.com/photos/31771226/pexels-photo-31771226.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',  // Modern Residential Villas Dubai Overview
    'https://images.pexels.com/photos/15994062/pexels-photo-15994062.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',  // Luxury Apartment with Swimming Pool
    'https://images.pexels.com/photos/4497544/pexels-photo-4497544.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',    // Villa with Pool and Garden
    'https://images.pexels.com/photos/31817155/pexels-photo-31817155.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',  // Luxury Seaside Villa Modern Interior
    'https://images.pexels.com/photos/31033420/pexels-photo-31033420.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',  // Aerial View Dubai Marina Skyline
    'https://images.pexels.com/photos/10514386/pexels-photo-10514386.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',  // Villas in front of Dubai Skyscrapers
];

function img(i) {
    return DUBAI_IMGS[i % DUBAI_IMGS.length];
}

async function updateImages() {
    await connectDB();

    // --- Properties: 3 rotating images per property ---
    const properties = await Property.find({}, '_id').lean();
    if (properties.length > 0) {
        const propertyOps = properties.map((p, i) => ({
            updateOne: {
                filter: { _id: p._id },
                update: { $set: { images: [img(i), img(i + 1), img(i + 2)] } },
            },
        }));
        await Property.bulkWrite(propertyOps);
        console.log(`✅ Updated images for ${properties.length} properties`);
    } else {
        console.log('⚠️  No properties found');
    }

    // --- Developer logos ---
    const developers = await Developer.find({}, '_id').lean();
    if (developers.length > 0) {
        const devOps = developers.map((d, i) => ({
            updateOne: {
                filter: { _id: d._id },
                update: { $set: { logo: img(i) } },
            },
        }));
        await Developer.bulkWrite(devOps);
        console.log(`✅ Updated logos for ${developers.length} developers`);
    }

    // --- Agent photos ---
    const agents = await Agent.find({}, '_id').lean();
    if (agents.length > 0) {
        const agentOps = agents.map((a, i) => ({
            updateOne: {
                filter: { _id: a._id },
                update: { $set: { photo: img(i + 5) } },
            },
        }));
        await Agent.bulkWrite(agentOps);
        console.log(`✅ Updated photos for ${agents.length} agents`);
    }

    // --- Blog cover images ---
    const blogs = await BlogPost.find({}, '_id').lean();
    if (blogs.length > 0) {
        const blogOps = blogs.map((b, i) => ({
            updateOne: {
                filter: { _id: b._id },
                update: { $set: { coverImage: img(i + 3) } },
            },
        }));
        await BlogPost.bulkWrite(blogOps);
        console.log(`✅ Updated cover images for ${blogs.length} blog posts`);
    }

    console.log('\n✅ All images updated successfully!');
    process.exit(0);
}

updateImages().catch((err) => {
    console.error('❌ Error updating images:', err);
    process.exit(1);
});
