import { Injectable } from "@nestjs/common";
import * as toStream from "buffer-to-stream";
import { UploadApiResponse, v2 } from 'cloudinary';


@Injectable()
export class CloudinaryRepository{
    async uploadImage(file: Express.Multer.File): Promise<UploadApiResponse>{
        return new Promise((resolve, reject) =>{
            const upload = v2.uploader.upload_stream(
                { resource_type: "image"},
                (error, result) => {
                    if(error) {
                        reject(error);
                    } else {
                        resolve (result);
                    }
                },
            );
            toStream(file.buffer).pipe(upload)
        })
      }
}