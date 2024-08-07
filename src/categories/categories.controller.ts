import {Controller, Get} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CategoryService } from "./categories.service";
import { SwaggerGetCategories, SwaggerSeederCategories } from "./swagger.decorator";


@ApiTags("Categories")
@Controller("categories")
export class CategoryController {
    constructor(private categoryService:CategoryService){}

    @Get()
    @SwaggerGetCategories()
    getCategories(){
        return this.categoryService.getCategories();
    }

    @Get("seeder")
    @SwaggerSeederCategories()
    preloadCategory(){
        return this.categoryService.preloadCategory();
    }
}




