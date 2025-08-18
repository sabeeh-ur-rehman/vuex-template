"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const Tenant_1 = __importDefault(require("../models/Tenant"));
const User_1 = __importDefault(require("../models/User"));
const Membership_1 = __importDefault(require("../models/Membership"));
const Customer_1 = __importDefault(require("../models/Customer"));
const Project_1 = __importDefault(require("../models/Project"));
const Proposal_1 = __importDefault(require("../models/Proposal"));
const Variation_1 = __importDefault(require("../models/Variation"));
const mongo_1 = __importDefault(require("./mongo"));
async function seed() {
    const mongoose = await (0, mongo_1.default)();
    const tenantId = new mongoose_1.Types.ObjectId('000000000000000000000001');
    const userId = new mongoose_1.Types.ObjectId('000000000000000000000002');
    const customerId = new mongoose_1.Types.ObjectId('000000000000000000000003');
    const projectId = new mongoose_1.Types.ObjectId('000000000000000000000004');
    const proposalId = new mongoose_1.Types.ObjectId('000000000000000000000005');
    const tenant = await Tenant_1.default.create({ _id: tenantId, tenantId, name: 'Demo Tenant' });
    const user = await User_1.default.create({ _id: userId, tenantId, email: 'admin@example.com' });
    await Membership_1.default.create({ tenantId, userId, role: 'admin' });
    const customer = await Customer_1.default.create({
        _id: customerId,
        tenantId,
        email: 'customer@example.com',
        firstName: 'John',
        lastName: 'Doe',
    });
    const project = await Project_1.default.create({
        _id: projectId,
        tenantId,
        customerId,
        name: 'Sample Project',
    });
    const proposal = await Proposal_1.default.create({
        _id: proposalId,
        tenantId,
        projectId,
        customerId,
        sections: [
            {
                id: 1,
                title: 'Main Section',
                complete: false,
                items: [{ id: 1, name: 'Initial item', qty: 1, price: 100 }],
            },
        ],
        showPrices: true,
        adjustment: 0,
        subtotal: 100,
        total: 100,
    });
    await Variation_1.default.create({
        tenantId,
        projectId,
        proposalId,
        name: 'Lighting Upgrade',
        status: 'Draft',
        items: [
            { description: 'Premium fixture', qty: 2, price: 50 },
            { description: 'Installation', qty: 5, price: 40 },
        ],
    });
    console.log('Seeded tenant ID:', tenant.tenantId.toString());
    console.log('Seeded admin user:', user.email);
    console.log('Seeded sample variation: Lighting Upgrade');
    await mongoose.disconnect();
}
seed().catch(err => {
    console.error(err);
    process.exit(1);
});
