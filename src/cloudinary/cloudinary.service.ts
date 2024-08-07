import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CloudinaryRepository } from './cloudinary.repository';
import { ProductsService } from '../products/products.service';
import { Product } from '../products/ProductEntity/products.entity';

@Injectable()
export class CloudinaryService {
constructor(
    private productService: ProductsService,
    private cloudiRepo:CloudinaryRepository,
    @InjectRepository(Product) private productRepo: Repository<Product>){}


  async updateImage(id: string, file: Express.Multer.File): Promise<Product> {
    const product = await this.productService.getProductById(id)
    if(!product){
        throw new NotFoundException('Product or file missing')
    } 

    const cloudinaryResponse = await this.cloudiRepo.uploadImage(file)
    
    if(!cloudinaryResponse){
      throw new ConflictException("Image could not be uploaded to Cloudinary")
    }

    const productUpdate = await this.productRepo.update(product, {
        imgurl: cloudinaryResponse.secure_url
     })
     if(!productUpdate){
        throw new ConflictException("Error updating product")
     }

    return await this.productRepo.findOneBy({id:id})
    }
}