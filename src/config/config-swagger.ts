import type { INestApplication } from "@nestjs/common";
import { SwaggerModule } from "@nestjs/swagger";
import { DocumentBuilder } from "@nestjs/swagger/dist/document-builder";

export const configSwagger = (app: INestApplication<any>) => {
  const config = new DocumentBuilder()
    .setTitle('E-Commerce API')
    .setDescription('API documentation for the E-Commerce application')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
}
