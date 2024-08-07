import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import * as data from "../data.json" 
import { ProductDto } from "./ProductDtos/product.dto";
import { pagination } from "../helpers/pagination.helper";
import { Product } from "./ProductEntity/products.entity";
import { Category } from "../categories/CategoryEntity/categories.entity";
import { OrderDetail } from "../orderDetail/OrderDetailEntity/orderDetail.entity";




@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)private productRepository: Repository<Product>,
        @InjectRepository(Category)private categoryRepository:Repository<Category>,
        @InjectRepository(OrderDetail)private orderDetailRepo: Repository<OrderDetail>){}

    async getProducts(page: number, limit: number){
        const allProducts:Product[] =  await this.productRepository.find({
                order: {
                    name: "ASC"
                },
                relations: {
                    category: true
                }
            });

        if(!allProducts){
            throw new NotFoundException("No products were found")
        }
        
        const paginatedProducts = pagination(page, limit, allProducts)
        return paginatedProducts;
            
    }

    async getProductById(id: string): Promise<Partial<Product>> {
        const response = await this.productRepository.findOneBy({id})
        if(!response){
            throw new NotFoundException('Product Not found')
        }
        return response
    }

    async createProduct(product: ProductDto): Promise<Product>{
        const checkProd = await this.productRepository.findOne({where: {name: product.name}})
        const findCat = await this.categoryRepository.findOne({where:{name:product.category}})
 
        if(!findCat){
            throw new BadRequestException("Category does not exist")
        }

        if(!checkProd){
             const newProduct = new Product()
             newProduct.name = product.name;
             newProduct.description = product.description;
             newProduct.price = product.price;
             newProduct.stock = product.stock;
             newProduct.imgurl = product.imgurl;
             newProduct.category = findCat;

            await this.productRepository.save(newProduct)
            return newProduct
         }else{
            throw new BadRequestException("Product already exists")
         }     
    }

    async preLoadProd(): Promise<{message: string}> {
        const findProduct =  await this.productRepository.find()
         if(findProduct.length > 0){
            return {message: "There are products in Data Base already"}
         }
        for(const oneProduct of data){
            const findCategory = await this.categoryRepository.findOne({where:{name:oneProduct.category}})
    
            if(!findCategory){
                throw new ConflictException("You must load the categories first")
            }
            await this.productRepository.save({...oneProduct, category:findCategory})
         
        } 
        return {message: "Products loaded succesfully"}
          
    }

    async updateProduct(id: string, modifiedProduct: Partial<Product>): Promise<{message: string}> {
        const product = await this.productRepository.findOneBy({id:id});
        
        if(!product){
            throw new NotFoundException('Product Not found')
        } 
        if (modifiedProduct.name !== product.name) {
            const existingProduct = await this.productRepository.findOneBy({ name: modifiedProduct.name });
    
            if (existingProduct) {
                throw new BadRequestException('This product name is already assigned to another ID in the database');
            }
        }
        await this.productRepository.update(id, modifiedProduct);

        return {message: `Product of id:${product.id} has been updated`}
    }

    async stockUpdate (id:string[]){       
        for(const oneId of id){
            const product:Product = await this.productRepository.findOneBy({id: oneId})
            
                if(product){
                    product.stock += 1;
                    await this.productRepository.save(product);
                } else{
                    throw new NotFoundException("product with id related to order_detail was not found")
                }
        }
    }

    async deleteProduct(id: string): Promise<{message: string}> {
        const product:Product =  await this.productRepository.findOne({
            where: {
                id:id
            },
            relations: ["orderDetails"]
        });

        if(!product){
            throw new NotFoundException("Product Not Found")
        } else{

            const orderDetail:OrderDetail[] = product.orderDetails
                
            if(orderDetail.length > 0){
                orderDetail.map((detail)=> detail.price -= product.price)
                await this.orderDetailRepo.save(orderDetail)
                   
            }
            await this.productRepository.remove(product)
        }
        return {message: `Product has been deleted succesfully`}
    }
}
