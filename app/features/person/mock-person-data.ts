import type { TPerson } from './person';

const firstPerson: TPerson = {
  id: 1,
  parentsRelationId: null,
  name: {
    firstName: 'Иван',
    lastName: 'Иванов',
  },
  birthDate: {
    year: 1985,
  },
  isDead: false,
  birthPlace: {},
  deathDate: {},
  deathPlace: {},
  diseases: [],
  career: [],
  relations: [],
};

const secondPerson: TPerson = {
  id: 2,
  parentsRelationId: 1,
  name: {
    firstName: 'Мария',
    lastName: 'Петрова',
    middleName: 'Сергеевна',
  },
  birthDate: {
    day: 15,
    month: 7,
    year: 1978,
  },
  birthPlace: {
    place: 'Москва, Россия',
  },
  isDead: true,
  deathDate: {
    day: 20,
    month: 3,
    year: 2020,
  },
  deathPlace: {
    place: 'Санкт-Петербург, Россия',
  },
  diseases: [
    {
      id: 1,
      name: 'Диабет',
      description: 'Сахарный диабет 2-го типа',
      dateRangeStart: {
        year: 2010,
      },
      dateRangeEnd: {},
    },
  ],
  career: [
    {
      id: 1,
      name: 'Инженер',
      description: 'Ведущий инженер-проектировщик',
      dateRangeStart: {
        year: 2005,
        month: 6,
      },
      dateRangeEnd: {
        year: 2020,
        month: 3,
      },
    },
  ],
  relations: [
    {
      type: 'marriage',
      role: 'spouse',
      persons: [
        {
          id: 1,
          name: {
            firstName: 'Иван',
            lastName: 'Иванов',
          },
        },
      ],
    },
  ],
};

const thirdPerson: TPerson = {
  id: 3,
  parentsRelationId: 2,
  name: {
    firstName: 'Анна',
    lastName: 'Сидорова',
  },
  birthDate: {
    year: 1995,
    month: 11,
  },
  birthPlace: {
    place: 'Новосибирск',
  },
  isDead: false,
  deathDate: {},
  deathPlace: {},
  diseases: [
    {
      id: 2,
      name: 'Астма',
      dateRangeStart: {},
      dateRangeEnd: {},
    },
  ],
  career: [],
  relations: [
    {
      type: 'god-parents',
      role: 'god-mother',
      persons: [
        {
          id: 2,
          name: {
            firstName: 'Мария',
            lastName: 'Петрова',
            middleName: 'Сергеевна',
          },
        },
      ],
    },
  ],
};

const fourthPerson: TPerson = {
  id: 4,
  parentsRelationId: 2,
  name: {
    firstName: 'Ольга',
    lastName: 'Сидорова',
    middleName: 'Александровна',
  },
  birthDate: {
    day: 12,
    month: 8,
    year: 1993,
  },
  birthPlace: {
    place: 'Новосибирск',
  },
  isDead: false,
  deathDate: {},
  deathPlace: {},
  diseases: [],
  career: [
    {
      id: 2,
      name: 'Врач',
      dateRangeStart: {
        year: 2017,
      },
      dateRangeEnd: {},
    },
  ],
  relations: [],
};

export const MOCK_PERSONS = [
  firstPerson,
  secondPerson,
  thirdPerson,
  fourthPerson,
];
