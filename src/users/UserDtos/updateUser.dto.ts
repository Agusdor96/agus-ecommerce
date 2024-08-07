import { PickType } from "@nestjs/swagger";
import { CreateUserDto } from "./users.dto"; 

export class updateUserDto extends PickType(CreateUserDto, [
    "name",
    "email",
    "address",
    "phone",
    "country",
    "city",
]){}