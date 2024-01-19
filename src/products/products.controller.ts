import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import {
  ResponseProductDto,
  ResponseProductsDto,
} from './dto/response-product.dto';

@Controller('products')
@ApiTags('Products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  @ApiOperation({
    summary:
      'List of products. You can filter by name, set page and limit. Default limit = 10',
  })
  @ApiResponse({
    status: 200,
    description: 'List of products',
    type: ResponseProductsDto,
  })
  @ApiQuery({ name: 'name', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  findAll(
    @Query('name') name?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.productsService.findAll(name, +page, +limit);
  }

  @Get('category/:category_id')
  @ApiOperation({ summary: 'List of products by category' })
  @ApiResponse({
    status: 200,
    description: 'List of products by category',
    type: ResponseProductsDto,
  })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @ApiParam({ name: 'category_id', required: true })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  findProductsByCategory(
    @Param('category_id', ParseIntPipe) category_id: number,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.productsService.findByCategory(category_id, +page, +limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detail of product' })
  @ApiResponse({
    status: 200,
    description: 'Detail of product',
    type: ResponseProductDto,
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiParam({ name: 'id', required: true })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a product' })
  @ApiResponse({ status: 201, description: 'Create a product' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiBody({ type: CreateProductDto })
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiConsumes('application/json')
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a product' })
  @ApiResponse({ status: 200, description: 'Update a product' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiParam({ name: 'id', required: true })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product' })
  @ApiResponse({ status: 200, description: 'Delete a product' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiParam({ name: 'id', required: true })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.remove(+id);
  }
}
