import {Test, TestingModule} from "@nestjs/testing";
import {BookRepository} from "../../../Infrastructure/Database/Repository/Book/book.repository";
import {MemberRepository} from "../../../Infrastructure/Database/Repository/Member/member.repository";
import {Response} from "express";
import {MemberService} from "../member.service";
import {MemberController} from "../member.controller";

describe('Member', () => {
  let bookRepository: BookRepository;
  let memberService: MemberService;
  let memberRepository: MemberRepository;
  let memberController: MemberController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MemberService,
        {
          provide: MemberRepository,
          useValue: {
            findMemberByName: jest.fn(),
          },
        },
        {
          provide: BookRepository,
          useValue: {
            existingBooks: jest.fn(),
          },
        },
      ],
      controllers: [MemberController]
    }).compile()

    memberRepository = module.get<MemberRepository>(MemberRepository);
    memberController = module.get<MemberController>(MemberController);
    memberService = module.get<MemberService>(MemberService);
    bookRepository = module.get<BookRepository>(BookRepository);
  })

  describe('Controller and Service', () => {
    it('should success', async () => {
      bookRepository.existingBooks = jest.fn().mockImplementation(() => Promise.resolve({
        allBooks: [],
        borrowedBooks: [],
      }))
      memberRepository.allMembers = jest.fn().mockImplementation(() => Promise.resolve([]))

      const mockResponse: any = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await memberController.detailMember(mockResponse as Response)

      expect(memberRepository.allMembers).toBeCalled()
      expect(bookRepository.existingBooks).toBeCalled()
    });
  })
})
