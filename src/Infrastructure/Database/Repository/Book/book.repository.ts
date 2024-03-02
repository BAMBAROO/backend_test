import {InjectModel} from "@nestjs/mongoose";
import {Book} from "../../../../Domain/Book/Model/book.schema";
import {BadRequestException, ForbiddenException, Injectable, NotFoundException} from "@nestjs/common";
import {Model} from "mongoose";
import {BorrowedBook} from "../../../../Domain/Book/Model/borrowedBooks.schema";


@Injectable()
export class BookRepository {
  constructor(
    @InjectModel(BorrowedBook.name) private borrowedBookModel: Model<BorrowedBook>,
    @InjectModel(Book.name) private bookModel: Model<Book>
  ) {
  }

  // async createBook(book: Book): Promise<Book | null> {
  //   const createBook = await this.bookModel.create(book);
  //   // await createBook.save()
  //   return createBook
  // }

  // async createBooks(books: Book[]): Promise<Book[] | null> {
  //   const createBooks = await this.bookModel.insertMany(books)
  //   return createBooks
  // }

  async borrowBook(book: BorrowedBook) {
    const borrowBook = await this.borrowedBookModel.create(book)
    return borrowBook
  }

  async findBookByCode(code: any): Promise<null | Book> {
    const book = await this.bookModel.findOne({
      code: code
    })
    if (!book) throw new NotFoundException({message: 'book is not found'})
    return book
  }

  async checkManyBorrowedBooks(memberName: any): Promise<BorrowedBook[] | boolean> {
    const totalBorrowedBooksByMemberName = await this.borrowedBookModel.find({
      member: memberName
    })
    if (totalBorrowedBooksByMemberName.length >= 2) throw new ForbiddenException({message: 'can not borrow more than 2 books'})
    return true
  }

  async checkBorrowedBook(code: any): Promise<BorrowedBook | boolean> {
    const borrowedBook = await this.borrowedBookModel.findOne({
      book: code
    })
    if (borrowedBook) throw new ForbiddenException({message: 'book have been borrowed'})
    return true
  }

  async findBorrowedBookByCodeAndName(code: any, name: any): Promise<BorrowedBook | null> {
    const borrowedBookByMember = await this.borrowedBookModel.findOne({
      book: code,
      member: name
    })
    if (!borrowedBookByMember) throw new BadRequestException({message: 'book and member does not match'})
    return borrowedBookByMember
  }

  async deleteBorrowedBook({ book, member }): Promise<boolean> {
    await this.borrowedBookModel.deleteOne({
      book: book,
      member: member
    })
    return true
  }

  async existingBooks() {
    const allBooks = await this.bookModel.find();
    const borrowedBooks = await this.borrowedBookModel.find();
    return {allBooks, borrowedBooks}
  }
}
