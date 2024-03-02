import {Test, TestingModule} from "@nestjs/testing";
import {BookService} from "../book.service";
import {BookController} from "../book.controller";
import {BookRepository} from "../../../Infrastructure/Database/Repository/Book/book.repository";
import {MemberRepository} from "../../../Infrastructure/Database/Repository/Member/member.repository";
import {Response} from "express";

describe('Books', () => {
  let bookService: BookService;
  let bookRepository: BookRepository;
  let memberRepository: MemberRepository;
  let bookController: BookController;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookService,
        {
          provide: BookRepository,
          useValue: {
            findBookByCode: jest.fn(),
            checkBorrowedBook: jest.fn(),
            checkManyBorrowedBooks: jest.fn(),
            borrowBook: jest.fn(),
            findBorrowedBookByCodeAndName: jest.fn(),
            deleteBorrowedBook: jest.fn(),
            existingBooks: jest.fn(),
          },
        },
        {
          provide: MemberRepository,
          useValue: {
            findMemberByName: jest.fn(),
            applyPenalty: jest.fn(),
          },
        },
      ],
      controllers: [BookController]
    }).compile()
    bookRepository = module.get<BookRepository>(BookRepository);
    memberRepository = module.get<MemberRepository>(MemberRepository);
    bookController = module.get<BookController>(BookController)
    bookService = module.get<BookService>(BookService)
  })

  describe('borrowBook', () => {
    it('should success', async () => {
      const date = new Date()
      const mockData = {
        book: 'asd',
        member: 'bryan',
        borrow_date: date,
        return_date: new Date(2025, 0, 1),
      }
      bookRepository.findBookByCode = jest.fn().mockImplementation(() => Promise.resolve(true))
      bookRepository.checkBorrowedBook = jest.fn().mockImplementation(() => Promise.resolve(true))
      bookRepository.checkManyBorrowedBooks = jest.fn().mockImplementation(() => Promise.resolve(true))
      bookRepository.borrowBook = jest.fn().mockImplementation(() => Promise.resolve(mockData))
      memberRepository.findMemberByName = jest.fn().mockImplementation(() => Promise.resolve({
        name: 'bryan',
        penalty_status: false,
        penalty_end_date: new Date(1900, 0, 1)
      }))

      const mockResponse: any = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await bookController.borrowBook({
        book: 'asd',
        member: 'bryan',
        borrow_date: date
      }, mockResponse as Response)

      expect(memberRepository.findMemberByName).toBeCalledWith(mockData.member)
      expect(bookRepository.findBookByCode).toBeCalledWith(mockData.book)
      expect(bookRepository.checkManyBorrowedBooks).toBeCalledWith(mockData.member)
      expect(bookRepository.checkBorrowedBook).toBeCalledWith(mockData.book)
      expect(bookRepository.borrowBook).toBeCalled()
    });
  })

  describe('returnBook', () => {
    it('should success case 1', async () => {
      const date = new Date()
      const mockData = {
        book: 'asd',
        member: 'bryan',
        borrow_date: date,
        return_date: new Date(2025, 0, 1),
      }

      bookRepository.findBookByCode = jest.fn().mockImplementation(() => Promise.resolve(true))
      memberRepository.findMemberByName = jest.fn().mockImplementation(() => Promise.resolve({
        name: 'bryan',
        penalty_status: false,
        penalty_end_date: new Date(1900, 0, 1)
      }))
      bookRepository.findBorrowedBookByCodeAndName = jest.fn().mockImplementation(() => Promise.resolve({
        book: 'asd',
        member: 'bryan',
        borrow_date: new Date(),
        return_date: new Date(2025, 0, 2)
      }))
      bookRepository.deleteBorrowedBook = jest.fn().mockImplementation(() => Promise.resolve(true))

      const mockResponse: any = {
        sendStatus: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await bookController.returnBook({
        book: 'asd',
        member: 'bryan',
      }, mockResponse as Response)

      expect(bookRepository.findBookByCode).toBeCalledWith(mockData.book)
      expect(memberRepository.findMemberByName).toBeCalledWith(mockData.member)
      expect(bookRepository.findBorrowedBookByCodeAndName).toBeCalled()
      expect(bookRepository.deleteBorrowedBook).toBeCalledWith({book: mockData.book, member: mockData.member})
    });

    it('should success case 2', async () => {
      const date = new Date()
      const mockData = {
        book: 'asd',
        member: 'bryan',
        borrow_date: date,
        return_date: new Date(2025, 0, 1),
      }

      bookRepository.findBookByCode = jest.fn().mockImplementation(() => Promise.resolve(true))
      memberRepository.findMemberByName = jest.fn().mockImplementation(() => Promise.resolve({
        name: 'bryan',
        penalty_status: false,
        penalty_end_date: new Date(1900, 0, 1)
      }))
      bookRepository.findBorrowedBookByCodeAndName = jest.fn().mockImplementation(() => Promise.resolve({
        book: 'asd',
        member: 'bryan',
        borrow_date: new Date(),
        return_date: new Date(1900, 0, 2)
      }))
      memberRepository.applyPenalty = jest.fn().mockImplementation(() => Promise.resolve(true))
      bookRepository.deleteBorrowedBook = jest.fn().mockImplementation(() => Promise.resolve(true))

      const mockResponse: any = {
        sendStatus: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await bookController.returnBook({
        book: 'asd',
        member: 'bryan',
      }, mockResponse as Response)

      expect(bookRepository.findBookByCode).toBeCalledWith(mockData.book)
      expect(memberRepository.findMemberByName).toBeCalledWith(mockData.member)
      expect(bookRepository.findBorrowedBookByCodeAndName).toBeCalled()
      expect(memberRepository.applyPenalty).toBeCalled()
      expect(bookRepository.deleteBorrowedBook).toBeCalledWith({book: mockData.book, member: mockData.member})
    });
  })

  describe('existingBooks', () => {
    it('should success', async () => {
      bookRepository.existingBooks = jest.fn().mockImplementation(() => Promise.resolve({
        allBooks: [],
        borrowedBooks: []
      }))

      const mockResponse: any = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await bookController.existingBook(mockResponse as Response)

      expect(bookRepository.existingBooks).toBeCalled()
    });
  })
})
