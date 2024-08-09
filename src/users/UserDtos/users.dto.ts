import { IsEmail, IsEmpty, IsNotEmpty, IsNumber, IsString, Length, Matches, MaxLength, MinLength} from "class-validator";
import { ApiHideProperty, ApiProperty } from "@nestjs/swagger";


export class CreateUserDto{
@ApiProperty({ description: 'User name', example: 'Matias Lopez' })
@IsNotEmpty()
@IsString()
@Length(3, 80)
name:string;

@ApiProperty({ description: 'User email', example: 'mati@mail.com' })
@IsNotEmpty()
@IsEmail()
@IsString()
email:string;

@ApiProperty({ description: 'User password', example: 'Hola1234?' })
@IsNotEmpty()
@IsString()
@MinLength(8)
@MaxLength(15)
@Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&?*])/,{
    message: "Password must contain at least one uppercase, one lowercase, one number and on special character "
})
password:string;

@ApiProperty({ description: 'must match with password', example: 'Hola1234?' })
@IsNotEmpty()
confirmPassword: string;

@ApiProperty({ description: 'User adress', example: 'False street 123' })
@IsNotEmpty()
@IsString()
@Length(3, 80)
address:string;

@ApiProperty({ description: 'User phone', example: 1124875487 })
@IsNotEmpty()
@Matches(/^\+?[1-9]\d{1,14}$/, {
    message: 'Phone number must be a valid international format'
  })
phone: string;

@ApiProperty({ description: 'The country where the user lives', example: 'Argentina' })
@IsNotEmpty()
@IsString()
@Length(5, 20)
country: string;

@ApiProperty({ description: 'City where the user lives', example: 'Mendoza' })
@IsNotEmpty()
@IsString()
@Length(5, 20)
city:string;


@ApiHideProperty()
@IsEmpty()
isAdmin?: boolean;
}