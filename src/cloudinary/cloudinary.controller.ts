import { Controller, FileTypeValidator, MaxFileSizeValidator, Param, ParseFilePipe, ParseUUIDPipe, Put, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { FileDto } from "./file.dto";
import { AuthGuard } from "../auth/auth.guard";
import { CloudinaryService } from "./cloudinary.service";
import { SwaggerUpdateFiles } from "./swagger.decorator";

@ApiTags("Cloudinary")
@Controller("file")
export class CloudinaryController{
    constructor(private cloudiService:CloudinaryService){}

    @ApiBearerAuth()
    @Put("uploadImage/:id")
    @SwaggerUpdateFiles()
    @UseGuards(AuthGuard)
    @UseInterceptors(FileInterceptor("file"))
    @ApiConsumes('multipart/form-data')
    @ApiBody({description: "Image to be uploaded",
               type: FileDto,
          })
     updateFile(
          @Param("id", ParseUUIDPipe)id:string,
          @UploadedFile(new ParseFilePipe({
               validators: [
                    new MaxFileSizeValidator({maxSize:200000,
                         message:"El Archivo debe ser menor de 200kb",
                    }),
                    new FileTypeValidator({
                         fileType:/(jpg|jpeg|png|webp)$/,
                    })
               ]
         })) file: Express.Multer.File) { 
               return this.cloudiService.updateImage(id, file)
          }
}
    
