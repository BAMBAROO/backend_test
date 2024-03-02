import {Global, Module} from "@nestjs/common";
import {BookRepository} from "./book.repository";
import {MongooseModule} from "@nestjs/mongoose";
import {Book, BookSchema} from "../../../../Domain/Book/Model/book.schema";
import {BorrowedBook, BorrowedBooksSchema} from "../../../../Domain/Book/Model/borrowedBooks.schema";
import {Member, MemberSchema} from "../../../../Domain/Member/Model/member.schema";

@Global()
@Module({
  imports: [MongooseModule.forFeature([
    {
      name: Book.name,
      schema: BookSchema
    },
    {
      name: BorrowedBook.name,
      schema: BorrowedBooksSchema
    },
    {
      name: Member.name,
      schema: MemberSchema
    }
  ])],
  providers: [BookRepository],
  exports: [BookRepository]
})
export class BookRepositoryModule {
}
