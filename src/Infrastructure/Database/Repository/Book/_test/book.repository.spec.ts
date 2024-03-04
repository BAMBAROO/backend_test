import {Test, TestingModule} from "@nestjs/testing";
import {getModelToken} from "@nestjs/mongoose";
import {Book} from "../../../../../Domain/Book/Model/book.schema";
import {BookRepository} from "../book.repository";
import {Model} from "mongoose";
import {BorrowedBook} from "../../../../../Domain/Book/Model/borrowedBooks.schema";
import {BadRequestException, ForbiddenException, NotFoundException} from "@nestjs/common";


describe('book repository', () => {
  let bookRepository: BookRepository;
  let bookModel: Model<Book>;
  let borrowedBookModel: Model<BorrowedBook>;
  const mockBookRepository = {
    create: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    deleteOne: jest.fn()
  }
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookRepository,
        {
          provide: getModelToken(Book.name),
          useValue: mockBookRepository
        },
        {
          provide: getModelToken(BorrowedBook.name),
          useValue: mockBookRepository
        }
      ]
    }).compile()

    bookRepository = module.get<BookRepository>(BookRepository)
    bookModel = module.get<Model<Book>>(getModelToken(Book.name))
    borrowedBookModel = module.get<Model<BorrowedBook>>(getModelToken(BorrowedBook.name))
  })

  describe('borrowBook', () => {
    it('should success', async () => {
      const payload = {
        book: 'SHR-11',
        member: 'Putri',
        borrow_date: new Date(),
        return_date: new Date()
      }
      // @ts-ignore
      jest.spyOn(borrowedBookModel, 'create').mockResolvedValue(payload);
      const result = await bookRepository.borrowBook(payload)

      expect(result).toBe(payload)
    });
  })

  describe('findBookByCode', () => {
    it('should success', async () => {
      const payload = {
        code: 'SHR-1',
        title: 'Putri',
        author: 'something',
        stock: 123
      }
      // @ts-ignore
      jest.spyOn(bookModel, 'findOne').mockResolvedValue(payload);
      const result = await bookRepository.findBookByCode('SHR-1')

      expect(bookModel.findOne).toHaveBeenCalledWith({"code": "SHR-1"})
      expect(result).toBe(payload)
    });

    it('should fail', async () => {
      // @ts-ignore
      jest.spyOn(bookModel, 'findOne').mockResolvedValue(null);

      await expect(bookRepository.findBookByCode('SHR-1'))
        .rejects
        .toThrowError('book is not found')
      await expect(bookRepository.findBookByCode('SHR-1'))
        .rejects
        .toThrowError(NotFoundException)
      expect(bookModel.findOne).toHaveBeenCalledWith({"code": "SHR-1"})
    });
  })

  describe('checkManyBorrowedBooks', () => {
    it('should success', async () => {
      const payload: BorrowedBook[] = [{
        book: 'SHR-1',
        member: 'bryan',
        borrow_date: new Date(),
        return_date: new Date()
      }]

      // @ts-ignore
      jest.spyOn(borrowedBookModel, 'find').mockResolvedValue(payload);
      const result = await bookRepository.checkManyBorrowedBooks('bryan')

      expect(result).toBe(true)
      expect(borrowedBookModel.find).toHaveBeenCalledWith({"member": "bryan"})
    });

    it('should fail', async () => {
      const payload: BorrowedBook[] = [{
        book: 'SHR-1',
        member: 'bryan',
        borrow_date: new Date(),
        return_date: new Date()
      },
        {
          book: 'asd',
          member: 'bryan',
          borrow_date: new Date(),
          return_date: new Date()
        }]

      // @ts-ignore
      jest.spyOn(borrowedBookModel, 'find').mockResolvedValue(payload);

      await expect(bookRepository.checkManyBorrowedBooks('bryan'))
        .rejects
        .toThrowError(ForbiddenException)
      await expect(bookRepository.checkManyBorrowedBooks('bryan'))
        .rejects
        .toThrowError('can not borrow more than 2 books')
      expect(borrowedBookModel.find).toHaveBeenCalledWith({"member": "bryan"})
    });
  })

  describe('checkBorrowedBook', () => {
    it('should success', async () => {
      // @ts-ignore
      jest.spyOn(bookModel, 'findOne').mockResolvedValue(null);

      await expect(bookRepository.checkBorrowedBook('SHR-1'))
        .resolves
        .toBe(true)
      expect(bookModel.findOne).toHaveBeenCalledWith({"book": "SHR-1"})
    });

    it('should fail', async () => {
      const payload: BorrowedBook = {
        book: 'SHR-1',
        member: 'bryan',
        borrow_date: new Date(),
        return_date: new Date()
      }

      // @ts-ignore
      jest.spyOn(bookModel, 'findOne').mockResolvedValue(payload);
      const result = await bookRepository.findBookByCode('SHR-1')

      await expect(bookRepository.checkBorrowedBook('SHR-1'))
        .rejects
        .toThrowError(ForbiddenException)
      await expect(bookRepository.checkBorrowedBook('SHR-1'))
        .rejects
        .toThrowError('book have been borrowed')
      expect(bookModel.findOne).toHaveBeenCalledWith({"code": "SHR-1"})
    });
  })

  describe('findBorrowedBookByCodeAndName', () => {
    it('should success', async () => {
      // @ts-ignore
      jest.spyOn(borrowedBookModel, 'findOne').mockResolvedValue(null);

      await expect(bookRepository.findBorrowedBookByCodeAndName('SHR-1', 'bryan'))
        .rejects
        .toThrowError('book and member does not match')
      await expect(bookRepository.findBorrowedBookByCodeAndName('SHR-1', 'bryan'))
        .rejects
        .toThrowError(BadRequestException)
      expect(borrowedBookModel.findOne).toHaveBeenCalledWith({book: "SHR-1", member: "bryan"})
    });

    it('should success', async () => {
      const mockPayload: BorrowedBook = {
        book: 'SHR-1',
        member: 'bryan',
        borrow_date: new Date(),
        return_date: new Date()
      }

      // @ts-ignore
      jest.spyOn(borrowedBookModel, 'findOne').mockResolvedValue(mockPayload);

      await expect(bookRepository.findBorrowedBookByCodeAndName('SHR-1', 'bryan'))
        .resolves
        .toBe(mockPayload)
      expect(borrowedBookModel.findOne).toHaveBeenCalledWith({book: 'SHR-1', member: 'bryan'})
    });
  })

  describe('deleteBorrowedBook', () => {
    it('should success', async () => {
      // @ts-ignore
      jest.spyOn(borrowedBookModel, 'deleteOne').mockResolvedValue(true);
      const result = await bookRepository.deleteBorrowedBook({book: 'SHR-1', member: 'bryan'})

      expect(borrowedBookModel.deleteOne).toHaveBeenCalledWith({book: 'SHR-1', member: 'bryan'})
      expect(result).toBe(true)
    });
  })

  describe('existingBooks', () => {
    it('should success allBooks', async () => {
      const mockBooks: Book[] = [{
        code: 'SHR-1',
        title: 'Putri',
        author: 'something',
        stock: 123
      }]

      // @ts-ignore
      jest.spyOn(bookModel, 'find').mockResolvedValue(mockBooks);
      const {allBooks} = await bookRepository.existingBooks();

      expect(allBooks).toEqual(mockBooks)
      expect(bookModel.find).toHaveBeenCalled()
      expect(borrowedBookModel.find).toHaveBeenCalled()
    });

    it('should success borrowedBooks', async () => {
      const mockBorrowedBooks: BorrowedBook[] = [{
        book: 'TW-11',
        member: 'bryan',
        borrow_date: new Date(),
        return_date: new Date()
      }]

      // @ts-ignore
      jest.spyOn(borrowedBookModel, 'find').mockResolvedValue(mockBorrowedBooks);
      const {borrowedBooks} = await bookRepository.existingBooks();

      expect(borrowedBooks).toEqual(mockBorrowedBooks)
      expect(bookModel.find).toHaveBeenCalled()
      expect(borrowedBookModel.find).toHaveBeenCalled()
    });
  })
})
