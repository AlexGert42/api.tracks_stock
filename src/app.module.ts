import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ServeStaticModule } from "@nestjs/serve-static";
import { TrackModule } from "./track/track.module";
import * as path from "path";
import { FileModule } from "./file/file.module";


@Module({
  imports: [
    TrackModule,
    FileModule,
    MongooseModule.forRoot("mongodb+srv://admin:root@cluster0.wrkbb.mongodb.net/track_platform?retryWrites=true&w=majority"),
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, "static")
    })
  ]
})
export class AppModule {}