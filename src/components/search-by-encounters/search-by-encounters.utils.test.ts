import { describe, expect, it } from 'vitest';
import { getDescription } from './search-by-encounters.utils';

const encounterType = (label: string, id = 0) => ({ id, label, value: label });

const details = {
  onOrAfter: '',
  onOrBefore: '',
  atLeastCount: 0,
  atMostCount: 0,
  encounterForms: [],
  encounterLocations: [],
  selectedEncounterTypes: [],
};

describe('getDescription', () => {
  it('uses the singular for one encounter type', () => {
    expect(getDescription({ ...details, selectedEncounterTypes: [encounterType('Visit Note')] })).toBe(
      'Patients with Encounter of Type Visit Note',
    );
  });

  it('uses the plural and joins the last two of several encounter types with and', () => {
    expect(
      getDescription({
        ...details,
        selectedEncounterTypes: [encounterType('Visit Note', 0), encounterType('Vitals', 1), encounterType('Lab', 2)],
      }),
    ).toBe('Patients with Encounter of Types Visit Note, Vitals and Lab');
  });

  it('describes any type when none is selected', () => {
    expect(getDescription(details)).toBe('Patients with Encounter of any Type');
  });

  it('separates the counts with single spaces', () => {
    expect(getDescription({ ...details, atLeastCount: 2, atMostCount: 3 })).toBe(
      'Patients with Encounter of any Type at least 2 times and at most 3 times',
    );
    expect(getDescription({ ...details, atMostCount: 1 })).toBe('Patients with Encounter of any Type at most 1 time');
  });
});
