import { describe, it, expect, vi } from 'vitest';
import { copyDocument } from '../src/services/copy.service';

describe('copyDocument', () => {
  it('copies an issue document and assigns new id', async () => {
    const issue = { _id: '1', title: 'Original Issue', status: 'open' };
    const model: any = {
      findById: vi.fn(() => ({ lean: () => Promise.resolve(issue) })),
      create: vi.fn((doc: any) =>
        Promise.resolve({ toObject: () => ({ _id: '2', ...doc }) })
      ),
    };

    const result = await copyDocument(model, '1', { status: 'new' } as any);

    expect(model.findById).toHaveBeenCalledWith('1');
    expect(model.create).toHaveBeenCalledWith({ title: 'Original Issue', status: 'new' });
    expect(result).toEqual({ _id: '2', title: 'Original Issue', status: 'new' });
  });

  it('returns null when job is missing', async () => {
    const model: any = {
      findById: vi.fn(() => ({ lean: () => Promise.resolve(null) })),
      create: vi.fn(),
    };

    const result = await copyDocument(model, 'job-1');
    expect(result).toBeNull();
    expect(model.create).not.toHaveBeenCalled();
  });
});
