import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppService } from './app.service';
import { ZoomModule } from './zoom/zoom.module';

@Module({
  imports: [ZoomModule,
    ServeStaticModule.forRoot({
      rootPath: 'C:\\Users\\allan\\Desktop\\app-prueba\\zoom-dashboard\\build', 
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
