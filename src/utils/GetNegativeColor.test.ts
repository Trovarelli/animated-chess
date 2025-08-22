import { GetNegativeColor } from './GetNegativeColor';

describe('GetNegativeColor', () => {
  it('returns opposite color for white and black', () => {
    expect(GetNegativeColor('white')).toBe('black');
    expect(GetNegativeColor('black')).toBe('white');
  });

  it('returns null for null input', () => {
    expect(GetNegativeColor(null)).toBeNull();
  });
});
