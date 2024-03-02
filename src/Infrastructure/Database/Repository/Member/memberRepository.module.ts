import {Global, Module} from "@nestjs/common";
import {MongooseModule} from "@nestjs/mongoose";
import {Book, BookSchema} from "../../../../Domain/Book/Model/book.schema";
import {BorrowedBook, BorrowedBooksSchema} from "../../../../Domain/Book/Model/borrowedBooks.schema";
import {Member, MemberSchema} from "../../../../Domain/Member/Model/member.schema";
import {MemberRepository} from "./member.repository";

@Global()
@Module({
  imports: [MongooseModule.forFeature([
    {
      name: Member.name,
      schema: MemberSchema
    }
  ])],
  providers: [MemberRepository],
  exports: [MemberRepository]
})
export class MemberRepositoryModule {
}
