import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UserModule } from "../users/users.module";

@Module({
    imports: [UserModule],
    providers: [AuthService],
    controllers: [AuthController],
})
export class AuthModule {}
