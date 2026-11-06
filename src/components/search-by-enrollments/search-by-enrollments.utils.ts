import { composeJson, formatDate } from '../../cohort-builder.utils';
import { type DropdownValue } from '../../types';

interface EnrollmentsSearchParams {
  enrolledOnOrAfter: string;
  enrolledOnOrBefore: string;
  completedOnOrAfter: string;
  completedOnOrBefore: string;
  selectedPrograms: DropdownValue[];
  selectedLocations: DropdownValue[];
}

export const getQueryDetails = ({
  enrolledOnOrAfter,
  enrolledOnOrBefore,
  completedOnOrAfter,
  completedOnOrBefore,
  selectedPrograms,
  selectedLocations,
}: EnrollmentsSearchParams) => {
  const searchParameter = {
    patientsWithEnrollment: [
      {
        name: 'programs',
        value: selectedPrograms?.map((location) => location.value),
      },
      enrolledOnOrAfter && {
        name: 'enrolledOnOrAfter',
        value: enrolledOnOrAfter,
      },
      enrolledOnOrBefore && {
        name: 'enrolledOnOrBefore',
        value: enrolledOnOrBefore,
      },
      completedOnOrAfter && {
        name: 'completedOnOrAfter',
        value: completedOnOrAfter,
      },
      completedOnOrBefore && {
        name: 'completedOnOrBefore',
        value: completedOnOrBefore,
      },
      {
        name: 'locationList',
        value: selectedLocations?.map((location) => location.value),
      },
    ],
  };
  const queryDetails = composeJson(searchParameter);

  return queryDetails;
};

const describeDates = (label: string, onOrAfter: string, onOrBefore: string) => {
  const since = onOrAfter ? ` since ${formatDate(onOrAfter)}` : '';
  const until = onOrBefore ? ` until ${formatDate(onOrBefore)}` : '';
  return since || until ? `, ${label}${since}${until}` : '';
};

export const getDescription = ({
  enrolledOnOrAfter,
  enrolledOnOrBefore,
  completedOnOrAfter,
  completedOnOrBefore,
  selectedPrograms,
  selectedLocations,
}: EnrollmentsSearchParams) => {
  let description = `Patients enrolled in ${selectedPrograms?.map((location) => location.label).join(', ')}`;

  if (selectedLocations?.length) {
    description = description + ` at ${selectedLocations?.map((location) => location.label).join(', ')}`;
  }

  description += describeDates('enrolled', enrolledOnOrAfter, enrolledOnOrBefore);
  description += describeDates('completed', completedOnOrAfter, completedOnOrBefore);

  return description;
};
