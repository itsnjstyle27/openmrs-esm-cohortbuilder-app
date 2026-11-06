import { addColumnsToDisplay } from '../../cohort-builder.utils';
import type { Query } from '../../types';

const tokenizeComposition = (search: string) =>
  search
    .replace(/([()])/g, ' $1 ')
    .trim()
    .split(/\s+/);

/** Whether the tokens read as operands joined by operators, where an operand is a number, NOT and an operand, or brackets. */
const isWellFormed = (tokens: string[]) => {
  let depth = 0;
  let expectOperand = true;
  for (const token of tokens) {
    if (expectOperand) {
      if (/^\d+$/.test(token)) {
        expectOperand = false;
      } else if (token === '(') {
        depth++;
      } else if (!/^not$/i.test(token)) {
        return false;
      }
    } else if (token === ')') {
      depth--;
      if (depth < 0) {
        return false;
      }
    } else if (/^(and|or|union|intersection)$/i.test(token)) {
      expectOperand = true;
    } else {
      return false;
    }
  }
  return depth === 0 && !expectOperand;
};

export const isCompositionValid = (search: string) => {
  const tokens = tokenizeComposition(search);
  return tokens.every((token) => /^(and|or|not|union|intersection|\d+|[()])$/i.test(token)) && isWellFormed(tokens);
};

const formatFilterCombination = (filterText: string, numberOfSearches: number) => {
  return filterText.replace(/\d+/g, (filterNumber) => (parseInt(filterNumber) + numberOfSearches).toString());
};

export const createCompositionQuery = (compositionQuery: string) => {
  const query: Query = {
    type: 'org.openmrs.module.reporting.dataset.definition.PatientDataSetDefinition',
    columns: addColumnsToDisplay(),
    rowFilters: [],
    customRowFilterCombination: '',
  };

  const searchTokens = tokenizeComposition(compositionQuery);

  searchTokens.forEach((eachToken) => {
    if (eachToken.match(/\d/)) {
      const history = JSON.parse(window.sessionStorage.getItem('openmrsHistory'));
      const operandQuery = history[parseInt(eachToken) - 1];

      const jsonRequestObject = operandQuery.parameters;
      jsonRequestObject.customRowFilterCombination = formatFilterCombination(
        jsonRequestObject.customRowFilterCombination,
        query.rowFilters.length,
      );
      query.customRowFilterCombination += `(${jsonRequestObject.customRowFilterCombination})`;
      query.rowFilters = query.rowFilters.concat(jsonRequestObject.rowFilters);
    } else {
      query.customRowFilterCombination += ` ${eachToken} `;
    }
  });

  return { query };
};
