import {Test, TestingModule} from "@nestjs/testing";
import {getModelToken} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {BadRequestException, ForbiddenException, NotFoundException} from "@nestjs/common";
import {Member} from "../../../../../Domain/Member/Model/member.schema";
import {MemberRepository} from "../member.repository";


describe('book repository', () => {
  let memberRepository: MemberRepository;
  let memberModel: Model<Member>;
  const mockMemberRepository = {
    create: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    updateOne: jest.fn()
  }
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MemberRepository,
        {
          provide: getModelToken(Member.name),
          useValue: mockMemberRepository
        }
      ]
    }).compile()
    memberRepository = module.get<MemberRepository>(MemberRepository)
    memberModel = module.get<Model<Member>>(getModelToken(Member.name))
  })

  describe('findMemberByName', () => {
    it('should success', async () => {
      const payload: Member = {
        name: 'bryan',
        penalty_status: false,
        penalty_end_date: new Date()
      }
      // @ts-ignore
      jest.spyOn(memberModel, 'findOne').mockResolvedValue(payload);
      const result = await memberRepository.findMemberByName('bryan')

      expect(memberModel.findOne).toHaveBeenCalledWith({name: 'bryan'})
      expect(result).toBe(payload)
    });

    it('should fail', async () => {
      // @ts-ignore
      jest.spyOn(memberModel, 'findOne').mockResolvedValue(null);

      await expect(memberRepository.findMemberByName('bryan'))
        .rejects
        .toThrowError(NotFoundException)
      await expect(memberRepository.findMemberByName('bryan'))
        .rejects
        .toThrowError('member is not found')
    });
  })

  describe('applyPenalty', () => {
    it('should success', async() => {
      const date = new Date()
      // @ts-ignore
      jest.spyOn(memberModel, 'updateOne').mockResolvedValue(true)
      await expect(memberRepository.applyPenalty('bryan', date))
        .resolves
        .toBe(true)
      expect(memberModel.updateOne).toBeCalledWith({
        name: 'bryan'
      }, {
        penalty_status: true,
        penalty_end_date: date
      })
    });
  })

  describe('allMembers', () => {
    it('should success', async () => {
      const mockResult: Member[] = [
        {
          name: 'bryan',
          penalty_status: false,
          penalty_end_date: new Date()
        },{
          name: 'bryan',
          penalty_status: false,
          penalty_end_date: new Date()
        }
      ]
      // @ts-ignore
      jest.spyOn(memberModel, 'find').mockResolvedValue(mockResult)
      const result = await memberRepository.allMembers()

      expect(result).toEqual(mockResult)
      expect(memberModel.find).toBeCalled()
    });
  })
})
