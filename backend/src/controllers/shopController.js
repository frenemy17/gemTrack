const prisma = require('../prismaClient');

// @route   GET /api/shop
// @desc    Get shop profile details
// @access  Private
exports.getProfile = async (req, res) => {
    try {
        let profile = await prisma.shopProfile.findFirst({ where: { userId: req.user.id } });

        if (!profile) {
            // Create default if not exists
            profile = await prisma.shopProfile.create({
                data: {
                    shopName: "My Jewelry Shop",
                    address: "",
                    phone: "",
                    gstin: "",
                    userId: req.user.id
                }
            });
        }

        res.json(profile);
    } catch (error) {
        console.error('Error fetching shop profile:', error);
        res.status(500).json({ message: 'Failed to fetch shop profile' });
    }
};

// @route   PUT /api/shop
// @desc    Update shop profile details
// @access  Private
exports.updateProfile = async (req, res) => {
    try {
        const { shopName, address, phone, gstin } = req.body;

        // Upsert ensuring we always work with the first record (or ID 1)
        // Since we don't know the ID for sure if created manually, findFirst is safer logic-wise,
        // but for upsert we need a unique constraint. ID is unique.
        // Let's first find the ID.

        let profile = await prisma.shopProfile.findFirst({ where: { userId: req.user.id } });

        if (profile) {
            profile = await prisma.shopProfile.update({
                where: { id: profile.id },
                data: { shopName, address, phone, gstin }
            });
        } else {
            profile = await prisma.shopProfile.create({
                data: { shopName, address, phone, gstin, userId: req.user.id }
            });
        }

        res.json(profile);
    } catch (error) {
        console.error('Error updating shop profile:', error);
        res.status(500).json({ message: 'Failed to update shop profile' });
    }
};
