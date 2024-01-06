import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { ProductDto, RawProductDto, CategoryDto } from './dto/product.dto';

// Mock data
const products = [
  { id: 1, cat_id: 1, name: 'Phone', price: 199 },
  { id: 2, cat_id: 1, name: 'Tablet', price: 299 },
  { id: 3, cat_id: 1, name: 'Labtop', price: 399 },
  { id: 4, cat_id: 2, name: 'Apple', price: 99 },
  { id: 5, cat_id: 2, name: 'Bag', price: 49 },
  { id: 6, cat_id: 3, name: 'Bread', price: 14 },
];

const categories = [
  { id: 1, name: 'Electronic' },
  { id: 2, name: 'Food' },
  { id: 3, name: 'Luxuary' },
];

// Helper function
function joinProductCategory(
  product: RawProductDto,
  categories: CategoryDto[],
): ProductDto {
  const itemCategory = categories.find(
    (category) => category.id === product.cat_id,
  ).name;
  const joinedProduct: ProductDto = { ...product, category: itemCategory };
  return joinedProduct;
}

// Service
@Injectable()
export class ProductsService {
  findAllProducts(): ProductDto[] {
    const result = products.map((product) =>
      joinProductCategory(product, categories),
    );
    console.log('get all products');
    return result;
  }

  findProductsByName(name: string): ProductDto[] {
    const result = products
      .filter((product) => product.name.includes(name))
      .map((product) => joinProductCategory(product, categories));
    if (result.length === 0) {
      throw new NotFoundException(`Product with name ${name} not found`);
    }

    return result;
  }

  findProductById(id: number): ProductDto {
    const product = products.find((product) => product.id === id);
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    const result = joinProductCategory(product, categories);

    return result;
  }

  createProduct(product: RawProductDto): ProductDto {
    if (!product.name || !product.price || !product.cat_id) {
      throw new BadRequestException('Missing name, price or cat_id');
    }

    const newProduct = {
      ...product,
      price: Number(product.price),
      id: products.length + 1,
      cat_id: Number(product.cat_id),
    };
    products.push(newProduct);

    return joinProductCategory(newProduct, categories);
  }

  updateProduct(id: number, product: RawProductDto): ProductDto {
    if (!product.name || !product.price || !product.cat_id) {
      throw new BadRequestException('Missing name, price or cat_id');
    }
    const index = products.findIndex((product) => product.id === id);
    if (index === -1) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    const updatedProduct = {
      ...product,
      price: Number(product.price),
      id: Number(id),
      cat_id: Number(product.cat_id),
    };
    products[index] = updatedProduct;

    return joinProductCategory(updatedProduct, categories);
  }

  deleteProcuct(id: number): ProductDto {
    const index = products.findIndex((product) => product.id === id);
    if (index === -1) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    const deletedProduct = products[index];
    products.splice(index, 1);

    return joinProductCategory(deletedProduct, categories);
  }
}
