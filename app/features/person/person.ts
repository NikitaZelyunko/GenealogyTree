// TODO добавить время
export type TDateSegments = {
  day: number;
  month: number;
  year: number;
};

type TPlaceSegments = {
  place: string;
};

type NameSegments = {
  firstName: string;
  lastName: string;
  middleName: string;
};

type TDisease = {
  id: number;
  name: string;
  description?: string;
  dateRangeStart: Partial<TDateSegments>;
  dateRangeEnd: Partial<TDateSegments>;
};

type TCareerPart = {
  id: number;
  name: string;
  description?: string;
  dateRangeStart: Partial<TDateSegments>;
  dateRangeEnd: Partial<TDateSegments>;
};

type TAnotherPersonInRelation = {
  id: number; // TODO возможно лучше string для uuid
  name: Partial<NameSegments>;
};

type TPersonRelationType = 'marriage' | 'god-parents';

type TPersonRelation = {
  type: TPersonRelationType;
  role: string;
  persons: TAnotherPersonInRelation[];
};

export type TPerson = {
  id: number; // TODO возможно лучше string для uuid
  parentsRelationId: number | null; // TODO возможно лучше string для uuid
  name: Partial<NameSegments>;
  birthDate: Partial<TDateSegments>;
  birthPlace: Partial<TPlaceSegments>;
  isDead: boolean;
  deathDate: Partial<TDateSegments>;
  deathPlace: Partial<TPlaceSegments>;
  diseases: TDisease[];
  career: TCareerPart[];
  relations: TPersonRelation[];
};
