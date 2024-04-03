export interface CreateProductReqBody {
  name: string;
  description: string;
  price: number;
  quantity: number;
  sku: string;
  image: string;
  brand: string;
  userId: string;
}