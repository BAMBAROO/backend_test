import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {MongooseModule} from "@nestjs/mongoose";
import {BookModule} from "./Application/Book/book.module";
import mongooseConfig from "./Infrastructure/Database/mongodb/mongoose.config";
import {MemberModule} from "./Application/Member/member.module";
import {BookRepositoryModule} from "./Infrastructure/Database/Repository/Book/bookRepository.module";
import {MemberRepositoryModule} from "./Infrastructure/Database/Repository/Member/memberRepository.module";

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: () => mongooseConfig
    }),
    BookModule,
    MemberModule,
    BookRepositoryModule,
    MemberRepositoryModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}
