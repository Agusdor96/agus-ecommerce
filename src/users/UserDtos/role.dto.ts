import { ApiProperty } from "@nestjs/swagger";

export class PassDto{
    @ApiProperty({ description: 'password'})
    password:string
}