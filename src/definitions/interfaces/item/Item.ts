import { ItemType } from 'definitions/enums';

export interface Item {
  type: ItemType;
  points: number;
  totalCount: number;
}
