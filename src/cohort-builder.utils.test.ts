import { afterEach, describe, expect, it, vi } from 'vitest';
import { composeJson, downloadCSV } from './cohort-builder.utils';

describe('composeJson', () => {
  it('requests the preferred patient identifier for search results', () => {
    const { query } = composeJson({});

    expect(query.columns).toContainEqual(
      expect.objectContaining({
        name: 'identifier',
        key: 'reporting.library.patientDataDefinition.builtIn.preferredIdentifier.identifier',
      }),
    );
  });
});

describe('downloadCSV', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  const downloadedFileName = (description: string) => {
    URL.createObjectURL = vi.fn(() => 'blob:test');
    let fileName: string | null = null;
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (this: HTMLAnchorElement) {
      fileName = this.getAttribute('download');
    });

    downloadCSV([], description);

    return fileName;
  };

  it('names the file with a .csv extension', () => {
    expect(downloadedFileName('Patients with NO Chronic viral hepatitis')).toBe(
      'Patients with NO Chronic viral hepatitis.csv',
    );
  });

  it('keeps the .csv extension when the description has a dot in it', () => {
    expect(downloadedFileName('Patients from POC Patient Consent v1.2')).toBe(
      'Patients from POC Patient Consent v1.2.csv',
    );
  });
});
