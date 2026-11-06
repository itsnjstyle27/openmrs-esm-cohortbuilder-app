import { describe, expect, it } from 'vitest';
import { getDescription } from './search-by-enrollments.utils';

const params = {
  enrolledOnOrAfter: '',
  enrolledOnOrBefore: '',
  completedOnOrAfter: '',
  completedOnOrBefore: '',
  selectedPrograms: [{ id: 0, label: 'HIV Program', value: 'hiv-uuid' }],
  selectedLocations: [],
};

describe('getDescription', () => {
  it('has no dates when none are set', () => {
    expect(getDescription(params)).toBe('Patients enrolled in HIV Program');
  });

  it('includes the enrollment dates', () => {
    expect(
      getDescription({
        ...params,
        enrolledOnOrAfter: '2024-01-15T00:00:00+00:00',
        enrolledOnOrBefore: '2024-03-20T00:00:00+00:00',
      }),
    ).toBe('Patients enrolled in HIV Program, enrolled since 15/1/2024 until 20/3/2024');
  });

  it('includes the completion dates after the location', () => {
    expect(
      getDescription({
        ...params,
        selectedLocations: [{ id: 0, label: 'Pharmacy', value: 'pharmacy-uuid' }],
        completedOnOrBefore: '2024-03-20T00:00:00+00:00',
      }),
    ).toBe('Patients enrolled in HIV Program at Pharmacy, completed until 20/3/2024');
  });

  it('tells apart two searches that only differ in their dates', () => {
    const first = getDescription({ ...params, enrolledOnOrAfter: '2024-01-15T00:00:00+00:00' });
    const second = getDescription({ ...params, completedOnOrAfter: '2024-01-15T00:00:00+00:00' });

    expect(first).not.toBe(second);
  });
});
