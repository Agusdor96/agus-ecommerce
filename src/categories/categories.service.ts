import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as data from "../data.json" 
import { Category } from "./CategoryEntity/categories.entity";

@Injectable()
export class CategoryService{
    constructor(
        @InjectRepository(Category) private categoryRepository: Repository<Category>
    ){}

    async getCategories(): Promise<Partial<Category>[]>{
        const response = await this.categoryRepository.find();
        if(!response.length){
            throw new NotFoundException ("No categories where found")
        } 
        const categoryName = response.map((cat)=> {
            const {id, ...response} = cat
            return response
        })
        return categoryName;
    }
    
    async preloadCategory(): Promise<{message: string}> {
        const categories = await this.categoryRepository.find()
        if(categories.length > 0){
            return {message: "There are categories in Data Base already"}
        }
        for(const cat of data){
                const findCategory = await this.categoryRepository.findOne({where: {name:cat.category}})
        
                if(!findCategory){
                    await this.categoryRepository.save({name:cat.category});
                }
            }
            return {message:"Categories loaded"}
          
    }
}