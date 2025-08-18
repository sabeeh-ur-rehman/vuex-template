"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const copy_service_1 = require("../src/services/copy.service");
(0, vitest_1.describe)('copyDocument', () => {
    (0, vitest_1.it)('copies an issue document and assigns new id', async () => {
        const issue = { _id: '1', title: 'Original Issue', status: 'open' };
        const model = {
            findById: vitest_1.vi.fn(() => ({ lean: () => Promise.resolve(issue) })),
            create: vitest_1.vi.fn((doc) => Promise.resolve({ toObject: () => ({ _id: '2', ...doc }) })),
        };
        const result = await (0, copy_service_1.copyDocument)(model, '1', { status: 'new' });
        (0, vitest_1.expect)(model.findById).toHaveBeenCalledWith('1');
        (0, vitest_1.expect)(model.create).toHaveBeenCalledWith({ title: 'Original Issue', status: 'new' });
        (0, vitest_1.expect)(result).toEqual({ _id: '2', title: 'Original Issue', status: 'new' });
    });
    (0, vitest_1.it)('returns null when job is missing', async () => {
        const model = {
            findById: vitest_1.vi.fn(() => ({ lean: () => Promise.resolve(null) })),
            create: vitest_1.vi.fn(),
        };
        const result = await (0, copy_service_1.copyDocument)(model, 'job-1');
        (0, vitest_1.expect)(result).toBeNull();
        (0, vitest_1.expect)(model.create).not.toHaveBeenCalled();
    });
});
