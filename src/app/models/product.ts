export interface Product {
  prodId: number;
  prodName: string;
  prodDesc: string;
  prodPrice: number;
  days: number;
  categoryId: number;
  userId: number;
  imageIds: number[];
  isFav: boolean;
}
