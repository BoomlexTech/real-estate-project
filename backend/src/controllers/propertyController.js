const Property = require('../models/Property');

// Helper — generate a URL-safe slug from a title
function makeSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

// GET /api/properties — paginated list with filters
const getProperties = async (req, res, next) => {
  try {
    const {
      type, bedrooms, minPrice, maxPrice, emirate, location,
      completionStatus, developer, status, sort,
      page = 1, limit = 12,
    } = req.query;

    const filter = {};
    if (type) filter.propertyType = type;
    if (bedrooms) filter.bedrooms = Number(bedrooms);
    if (emirate) filter['location.emirate'] = emirate;
    if (location) filter['location.area'] = { $regex: location, $options: 'i' };
    if (completionStatus) filter.completionStatus = completionStatus;
    if (developer) filter.developer = developer;
    // Handle status — 'off-plan' and 'ready' map to completionStatus
    if (status === 'off-plan') {
      filter.completionStatus = 'off-plan';
    } else if (status === 'ready' || status === 'ready-to-move') {
      filter.completionStatus = 'ready-to-move';
    } else if (status) {
      filter.status = status;
    }
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'price_asc') sortOption = { price: 1 };
    else if (sort === 'price_desc') sortOption = { price: -1 };
    else if (sort === 'newest') sortOption = { createdAt: -1 };
    else if (sort === 'featured') sortOption = { isFeatured: -1, createdAt: -1 };

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(50, Math.max(1, Number(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [data, total] = await Promise.all([
      Property.find(filter)
        .populate('developer', 'name slug logo')
        .populate('agent', 'name photo phone email')
        .sort(sortOption)
        .skip(skip)
        .limit(limitNum),
      Property.countDocuments(filter),
    ]);
    res.json({
      data,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/properties/id/:id  — fetch by MongoDB _id (owner or admin only)
const getPropertyByObjectId = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('developer', 'name')
      .populate('agent', 'name email');

    if (!property)
      return res.status(404).json({ success: false, message: 'Property not found' });

    // Only the owning agent or an admin may fetch by raw ID
    if (req.user.role !== 'admin' && property.agent?._id.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: 'Not authorized' });

    res.json({ success: true, data: property });
  } catch (err) {
    next(err);
  }
};

// GET /api/properties/:slug
const getProperty = async (req, res, next) => {
  try {
    const property = await Property.findOne({ slug: req.params.slug })
      .populate('developer', 'name slug logo description website')
      .populate('agent', 'name photo phone email languages specialization bio');

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    // Attach propertyCount to the agent so the "Listed By" card shows the correct number
    const propertyObj = property.toObject();
    if (propertyObj.agent?._id) {
      propertyObj.agent.propertyCount = await Property.countDocuments({ agent: propertyObj.agent._id });
    }

    res.json(propertyObj);
  } catch (err) {
    next(err);
  }
};

// POST /api/properties  — approved agent or admin
const createProperty = async (req, res, next) => {
  try {
    const {
      title, description, price, priceLabel,
      location, propertyType, bedrooms, bathrooms, squareFt,
      completionYear, completionStatus, paymentPlan,
      developer, images, amenities, status,
    } = req.body;

    if (!title || !price || !propertyType)
      return res.status(400).json({ success: false, message: 'title, price and propertyType are required' });

    // Build a unique slug
    let slug = makeSlug(title);
    const exists = await Property.findOne({ slug });
    if (exists) slug = `${slug}-${Date.now()}`;

    const property = await Property.create({
      title,
      slug,
      description: description || '',
      price,
      priceLabel: priceLabel || `AED ${(price / 1_000_000).toFixed(1)}M`,
      location: location || {},
      propertyType,
      bedrooms: bedrooms || 0,
      bathrooms: bathrooms || 0,
      squareFt: squareFt || 0,
      completionYear: completionYear || '',
      completionStatus: completionStatus || 'ready-to-move',
      paymentPlan: paymentPlan || {},
      developer: developer || null,
      agent: req.user._id,
      images: images || [],
      amenities: amenities || [],
      status: status || 'for-sale',
    });

    res.status(201).json({ success: true, data: property });
  } catch (err) {
    next(err);
  }
};

// PUT /api/properties/:id  — owner agent or admin
const updateProperty = async (req, res, next) => {
  try {
    const {
      title, description, price, priceLabel,
      location, propertyType, bedrooms, bathrooms, squareFt,
      completionYear, completionStatus, paymentPlan,
      developer, images, amenities, status,
    } = req.body;

    const property = await Property.findById(req.params.id);
    if (!property)
      return res.status(404).json({ success: false, message: 'Property not found' });

    // Agents: stage changes for admin approval instead of applying directly
    if (req.user.role !== 'admin') {
      property.pendingChanges = {
        title, description, price, priceLabel, location, propertyType,
        bedrooms, bathrooms, squareFt, completionYear, completionStatus,
        paymentPlan, developer, images, amenities, status,
      };
      property.hasPendingChanges = true;
      property.markModified('pendingChanges');
      await property.save();
      return res.json({ success: true, message: 'Changes submitted for admin approval' });
    }

    // Admin: apply changes directly
    // Rebuild slug only if title changed
    if (title && title !== property.title) {
      let newSlug = makeSlug(title);
      const exists = await Property.findOne({ slug: newSlug, _id: { $ne: property._id } });
      if (exists) newSlug = `${newSlug}-${Date.now()}`;
      property.slug = newSlug;
      property.title = title;
    }

    if (description !== undefined) property.description = description;
    if (price !== undefined) {
      property.price = price;
      property.priceLabel = priceLabel || `AED ${(price / 1_000_000).toFixed(1)}M`;
    }
    if (priceLabel !== undefined) property.priceLabel = priceLabel;
    if (location !== undefined) property.location = location;
    if (propertyType !== undefined) property.propertyType = propertyType;
    if (bedrooms !== undefined) property.bedrooms = bedrooms;
    if (bathrooms !== undefined) property.bathrooms = bathrooms;
    if (squareFt !== undefined) property.squareFt = squareFt;
    if (completionYear !== undefined) property.completionYear = completionYear;
    if (completionStatus !== undefined) property.completionStatus = completionStatus;
    if (paymentPlan !== undefined) property.paymentPlan = paymentPlan;
    if (developer !== undefined) property.developer = developer;
    if (images !== undefined) property.images = images;
    if (amenities !== undefined) property.amenities = amenities;
    if (status !== undefined) property.status = status;

    await property.save();
    res.json({ success: true, data: property });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/properties/:id  — owner agent or admin
const deleteProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property)
      return res.status(404).json({ success: false, message: 'Property not found' });

    await property.deleteOne();
    res.json({ success: true, message: 'Property deleted' });
  } catch (err) {
    next(err);
  }
};

// GET /api/properties/mine  — returns properties owned by the requesting agent/admin
const getMyProperties = async (req, res, next) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Number(req.query.limit) || 20);
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      Property.find({ agent: req.user._id })
        .populate('developer', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Property.countDocuments({ agent: req.user._id }),
    ]);

    res.json({ success: true, data, total, page, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/properties/:id/feature  — admin only
const toggleFeatured = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property)
      return res.status(404).json({ success: false, message: 'Property not found' });

    property.isFeatured = !property.isFeatured;
    await property.save();
    res.json({ success: true, isFeatured: property.isFeatured });
  } catch (err) {
    next(err);
  }
};

module.exports = { getProperties, getProperty, getPropertyByObjectId, getMyProperties, createProperty, updateProperty, deleteProperty, toggleFeatured };
