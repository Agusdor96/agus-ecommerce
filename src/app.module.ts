import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import typeorm from './config/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './users/users.module';
import { OrderModule } from './orders/orders.module';
import { ProductsModule } from './products/products.module';
import { CategoryModule } from './categories/category.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { Category } from './categories/CategoryEntity/categories.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env.development',
      load:[typeorm]
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        configService.get('typeorm'),
    }),
    JwtModule.register({
      global: true,
      signOptions: {expiresIn: "1h"},
      secret: process.env.JWT_SECRET,
    }),
    TypeOrmModule.forFeature([Category]),
    UserModule,
    ProductsModule,
    AuthModule,
    CategoryModule,
    OrderModule,
    CloudinaryModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
