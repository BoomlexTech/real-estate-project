const MortgageInquiry = require('../models/MortgageInquiry');

// POST /api/mortgage/inquiry
const submitInquiry = async (req, res, next) => {
    try {
        const { fullName, phone, email, loanAmountAED } = req.body;

        if (!fullName || !phone || !email || !loanAmountAED) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        const inquiry = await MortgageInquiry.create({ fullName, phone, email, loanAmountAED });

        res.status(201).json({ success: true, message: 'Mortgage inquiry submitted successfully', data: inquiry });
    } catch (err) {
        next(err);
    }
};

module.exports = { submitInquiry };
