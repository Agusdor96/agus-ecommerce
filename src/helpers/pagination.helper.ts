import { ConflictException } from "@nestjs/common";

export function pagination(page:number, limit:number, entityArray:any[]){
    limit = limit ?? 5;
    page = page ?? 1;

    const start = (page - 1) * limit;
        const end = start + limit;

        const pagination = entityArray.slice(start, end);
        if(!pagination){
            throw new ConflictException("Error in pagination")
        }
        return pagination;

}