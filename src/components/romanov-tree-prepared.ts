import type { TTree } from './tree';

export const RomanovTreePrepared: TTree<any> = {
  name: 'Root',
  hidden: true,
  type: 'person',
  children: [
    {
      name: 'Михаил Федорович',
      type: 'person',
    },
    {
      name: '',
      type: 'marriage',
      children: [
        {
          name: 'Мария Милославская',
          type: 'person',
          noParent: true,
        },
        {
          name: '',
          type: 'marriage',
          children: [
            {
              name: 'Федор Алексеевич',
              type: 'person',
            },
            {
              name: 'Иван V',
              type: 'person',
            },
            {
              name: '',
              type: 'marriage',
            },
            {
              name: 'Прасковья Салтыкова',
              type: 'person',
              noParent: true,
            },
            {
              name: 'Софья Алексеевна',
              type: 'person',
            },
          ],
        },
        {
          name: 'Алексей Михайлович',
          type: 'person',
        },
        {
          name: '',
          type: 'marriage',
          children: [
            {
              name: 'Евдокия Лопухина',
              type: 'person',
              noParent: true,
            },
            {
              name: '',
              type: 'marriage',
            },
            {
              name: 'Петр I',
              type: 'person',
            },
            {
              name: '',
              type: 'marriage',
            },
            {
              name: 'Екатерина I',
              type: 'person',
              noParent: true,
            },
          ],
        },
        {
          name: 'Наталья Нарышкина',
          type: 'person',
          noParent: true,
        },
      ],
    },
    {
      name: 'Евдокия Стрешнева',
      type: 'person',
      noParent: true,
    },
  ],
};
