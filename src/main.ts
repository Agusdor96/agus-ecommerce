import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ProductsService } from './products/products.service';
import { loggerGlobal } from './middlewares/logger.middleware';
import { CategoryService } from './categories/categories.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.use(loggerGlobal)

  const swaggerConfig = new DocumentBuilder()
                            .setTitle("E-commerce API")
                            .setDescription(`${""}
                              This API is designed to be used in eCommerce applications as it provides the necessary endpoints for managing users, products, and orders.
                              ${" "}
                              Currently, there are only two roles defined: USER and ADMIN. Endpoints without locks are publicly accessible.
                              ${""}
                              The remaining endpoints that are locked can only be accessed by registered users. For endpoints restricted to admins only, this will be indicated in the 
                              ${""}
                              description of each endpoint.`)
                            .setVersion("1.0")
                            .addBearerAuth()
                            .build()
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("api", app, document)

  const categoryService = app.get(CategoryService)
  await categoryService.preloadCategory()
  const productsService = app.get(ProductsService)
  await productsService.preLoadProd()
  
  await app.listen(3000);
}

bootstrap();
