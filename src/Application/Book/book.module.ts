import {Module} from '@nestjs/common';
import {MongooseModule} from "@nestjs/mongoose";
import {BookController} from "./book.controller";
import {BookService} from "./book.service";
import {BookRepository} from "../../Infrastructure/Database/Repository/Book/book.repository";
import {Book, BookSchema} from "../../Domain/Book/Model/book.schema";
import {BorrowedBook, BorrowedBooksSchema} from "../../Domain/Book/Model/borrowedBooks.schema";
import {MemberRepository} from "../../Infrastructure/Database/Repository/Member/member.repository";
import {Member, MemberSchema} from "../../Domain/Member/Model/member.schema";

@Module({
  controllers: [BookController],
  providers: [BookService],
  exports: [BookService]
})
export class BookModule {
}
