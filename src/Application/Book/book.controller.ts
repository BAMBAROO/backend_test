// books/application/book.controller.ts

import {Controller, Get, Post, Put, Delete, Param, Body, NotFoundException, Res} from '@nestjs/common';
import {BookService} from './book.service';
import {BookDto, BorrowedBookDto, ReturnBook} from './dto/book.dto';
import {Response} from "express";

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {
  }

  @Get()
  async existingBook(@Res() res: Response) {
    return await this.bookService.existingBooks(res);
  }

  @Post('borrow')
  async borrowBook(@Body() body: BorrowedBookDto, @Res() res: Response) {
    return await this.bookService.borrowBook(body, res);
  }

  @Post('return')
  async returnBook(@Body() returnBook: ReturnBook, @Res() res: Response) {
    return await this.bookService.returnBook(returnBook, res);
  }

  /** to Insert or InsertMany Only **/

  // @Post()
  // async createBook(@Body() body: BookDto, @Res() res: Response) {
  //   return await this.bookService.createBook(body, res);
  // }

  // @Post('books')
  // async createBooks(@Body() body: BookDto[], @Res() res: Response) {
  //   return await this.bookService.createBooks(body, res);
  // }
}
