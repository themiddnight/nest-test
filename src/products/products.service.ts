import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Op } from 'sequelize';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './models/product.model';
import { Category } from '../category/models/category.model';

@Injectable()
export class ProductsService {
  // select
  //   p.product_id, p.name, p.price, p.image_url,
  //   c.name category,
  //   avg(r.rating) rating,
  //   count(r.rating) review_count
  // from "Products" p
  // join "Categories" c
  //   on p.category_id = c.category_id
  // join "Reviews" r
  //   on p.product_id = r.product_id
  // group by p.product_id, c.name;
  /**
   * Todo: Include average rating and review count in the response.
   */
  async findAll(
    name: string,
    category_id: number,
    page: number,
    limit: number,
  ) {
    const whereCondition: any = {};
    if (name) {
      whereCondition.name = { [Op.like]: `%${name}%` };
    }
    if (category_id) {
      whereCondition.category_id = category_id;
    }
    page = page || 1;
    limit = limit || 10;
    const productCount = await Product.count({
      where: whereCondition,
    });
    const result = await Product.findAll({
      attributes: { exclude: ['description', 'createdAt', 'updatedAt'] },
      where: whereCondition,
      offset: (page - 1) * limit,
      limit: limit,
      include: [
        {
          model: Category,
          attributes: ['name'],
          required: true,
        },
      ],
      raw: true,
    });
    if (result.length === 0) {
      throw new NotFoundException({
        message: 'Could not find products.',
        data: [],
      });
    }
    return {
      message: 'Success',
      current_page: page,
      total_pages: Math.ceil(productCount / limit),
      data: result,
    };
  }

  /**
   * Todo: Include average rating and review count in the response.
   */
  async findOne(id: number) {
    const result = await Product.findOne({
      where: { product_id: id },
      include: [
        {
          model: Category,
          attributes: ['name'],
          required: true,
        },
      ],
      raw: true,
    });
    if (!result) {
      throw new NotFoundException({
        message: `Could not find product with id ${id}.`,
        data: {},
      });
    }
    return {
      message: 'Success',
      data: result,
    };
  }

  async create(createProductDto: CreateProductDto) {
    try {
      const result = await Product.create(createProductDto);
      return {
        message: `Product with id ${result.product_id} has been created.`,
        data: result,
      };
    } catch (error) {
      throw new BadRequestException({
        message: error.message,
        data: {},
      });
    }
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await Product.findOne({ where: { product_id: id } });
    if (!product) {
      throw new NotFoundException({
        message: `Could not find product with id ${id}.`,
      });
    }
    product.name = updateProductDto.name || product.name;
    product.description = updateProductDto.description || product.description;
    product.price = updateProductDto.price || product.price;
    product.category_id = updateProductDto.category_id || product.category_id;
    try {
      const result = await product.save();
      return {
        message: `Product with id ${id} has been updated.`,
        data: result,
      };
    } catch (error) {
      throw new BadRequestException({
        message: error.message,
      });
    }
  }

  async remove(id: number) {
    try {
      const result = await Product.destroy({ where: { product_id: id } });
      if (result === 0) {
        throw new NotFoundException({
          message: `Could not find product with id ${id}.`,
        });
      }
      return {
        message: `Product with id ${id} has been deleted.`,
      };
    } catch (error) {
      throw new BadRequestException({
        message: error.message,
      });
    }
  }
}
