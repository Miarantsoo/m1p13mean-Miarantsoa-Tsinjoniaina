import ShopRequest from "./shopRequest.model.js";
import {sendShopRequestEmail, sendShopRequestRejectionEmail} from "@/utils/mail.service.js";

export const getAllShopRequests = async (status, page = 1, limit = 10) => {
    const skip = (page - 1) * limit;

    const query = status ? { status } : {};

    const [shopRequests, total] = await Promise.all([
        ShopRequest.find(query)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 }),
        ShopRequest.countDocuments(query)
    ]);

    return {
        data: shopRequests,
        pagination: {
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalItems: total,
            itemsPerPage: limit,
            hasNextPage: page < Math.ceil(total / limit),
            hasPreviousPage: page > 1
        }
    };
}

export const createShopRequest = async (shopRequestData) => {
    const shopRequest = new ShopRequest(shopRequestData);

    await sendShopRequestEmail({recipient: shopRequest.email, covering_letter: shopRequest.covering_letter})

    return await shopRequest.save();
};

export const rejectShopRequest = async (id, reason) => {
    const trimedId = id.trim();
    const shopRequest = await ShopRequest.findById(id);

    if (!shopRequest) {
        throw new Error('Shop request not found');
    }

    shopRequest.status = 'rejected';
    shopRequest.rejection_reason = reason;

    sendShopRequestRejectionEmail({recipient: shopRequest.email, reason});

    return await shopRequest.save();
}