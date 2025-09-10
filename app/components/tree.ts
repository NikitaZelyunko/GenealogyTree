export type TTree<Data> = {
  name: string;
  id?: string;
  hidden?: boolean;
  type: 'person' | 'marriage';
  noParent?: boolean;
  data?: Data;
  children?: TTree<Data>[];
};
