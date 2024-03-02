import { Module } from '@nestjs/common';
import {MongooseModule} from "@nestjs/mongoose";
import {MemberService} from "./member.service";
import {MemberRepository} from "../../Infrastructure/Database/Repository/Member/member.repository";
import {MemberController} from "./member.controller";
import {Member, MemberSchema} from "../../Domain/Member/Model/member.schema";
import {Book, BookSchema} from "../../Domain/Book/Model/book.schema";
import {BookRepository} from "../../Infrastructure/Database/Repository/Book/book.repository";
import {BorrowedBook, BorrowedBooksSchema} from "../../Domain/Book/Model/borrowedBooks.schema";

@Module({
  imports: [MongooseModule.forFeature([{name: Member.name, schema: MemberSchema},{name: Book.name, schema: BookSchema},{name: BorrowedBook.name, schema: BorrowedBooksSchema}])],
  controllers: [MemberController],
  providers: [MemberService, MemberRepository, BookRepository],
  exports: [MemberService]
})
export class MemberModule {}
