import {ForbiddenException, HttpException, HttpStatus, Injectable, NotFoundException} from "@nestjs/common";
import {BookRepository} from "../../Infrastructure/Database/Repository/Book/book.repository";
import {Response} from "express";
import {BookDto, ReturnBook} from "./dto/book.dto";
import {BorrowedBook} from "../../Domain/Book/Model/borrowedBooks.schema";
import {MemberRepository} from "../../Infrastructure/Database/Repository/Member/member.repository";


@Injectable()
export class BookService {
  constructor(
    private readonly bookRepository: BookRepository,
    private readonly memberRepository: MemberRepository
  ) {}

  async borrowBook(book, res: Response) {
    try {
      await this.bookRepository.findBookByCode(book.book)
      await this.bookRepository.checkBorrowedBook(book.book)
      const theMember = await this.memberRepository.findMemberByName(book.member)
      if (!theMember) throw new NotFoundException({message: 'member is not found'})
      if (theMember.penalty_status) {
        if (theMember.penalty_end_date.getTime() > new Date().getTime()) {
          throw new ForbiddenException({message: 'you are on penalty'});
        }
      }
      await this.bookRepository.checkManyBorrowedBooks(theMember.name)
      const today = new Date()
      const sevenDaysLater = new Date(today)
      sevenDaysLater.setDate(today.getDate() + 7)
      book.return_date = sevenDaysLater
      const borrowed = await this.bookRepository.borrowBook(book)
      const response = {message: 'borrow a book', data: borrowed}
      return res.status(HttpStatus.CREATED).json(response)
    } catch (e) {
      console.log(e)
      throw new HttpException({
        message: e.message, status: e.statusCode
      }, e.statusCode)
    }
  }

  async returnBook(returnBook: ReturnBook, res: Response) {
    try {
      const {book, member} = returnBook;
      await this.bookRepository.findBookByCode(book)
      await this.memberRepository.findMemberByName(member)
      const borrowedBookByMember =
        await this.bookRepository.findBorrowedBookByCodeAndName(book, member)
      const dateNow = new Date().getTime()
      if (borrowedBookByMember.return_date.getTime() < dateNow) {
        const today = new Date()
        const threeDaysLater = new Date(today)
        threeDaysLater.setDate(today.getDate() + 3)
        await this.memberRepository.applyPenalty(member,threeDaysLater)
      }
      await this.bookRepository.deleteBorrowedBook({book, member})
      return res.sendStatus(HttpStatus.NO_CONTENT)
    } catch (e) {
      throw new HttpException({
        message: e.message, status: e.statusCode
      }, e.statusCode)
    }
  }

  async existingBooks(res: Response) {
    try {
      const {allBooks, borrowedBooks} = await this.bookRepository.existingBooks()
      // @ts-ignore
      const remainingBooks = allBooks.filter(book1 => !borrowedBooks.some(book2 => book1.code === book2.book));
      const response = {message: 'success get existing books', data: remainingBooks}
      return res.status(HttpStatus.OK).json(response)
    } catch (e) {
      throw new HttpException({
        message: e.message, status: e.statusCode
      }, e.statusCode)
    }
  }

  /** to Insert or InsertMany Books Only **/

  // async createBook(book: BookDto, res: Response) {
  //   try {
  //     const newBook = await this.bookRepository.createBook(book);
  //     const response = {mesage: 'success create book', data: newBook}
  //     return res.status(HttpStatus.CREATED).json(response)
  //   } catch (e) {
  //     console.log(e)
  //     throw new HttpException({
  //       message: e.message, status: e.statusCode
  //     }, e.statusCode)
  //   }
  // }

  // async createBooks(books: BookDto[], res: Response) {
  //   try {
  //     const newBooks = await this.bookRepository.createBooks(books);
  //     const response = {mesage: 'success create book', data: newBooks}
  //     return res.status(HttpStatus.CREATED).json(response)
  //   } catch (e) {
  //     console.log(e)
  //     throw new HttpException({
  //       message: e.message, status: e.statusCode
  //     }, e.statusCode)
  //   }
  // }
}
