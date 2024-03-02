import {MemberRepository} from "../../Infrastructure/Database/Repository/Member/member.repository";
import {Response} from "express";
import {MemberDto} from "./dto/member.dto";
import {HttpException, HttpStatus, Injectable, NotFoundException} from "@nestjs/common";
import {BookRepository} from "../../Infrastructure/Database/Repository/Book/book.repository";

@Injectable()
export class MemberService {
  constructor(private readonly memberRepository: MemberRepository, private readonly bookrepository: BookRepository) {
  }

  async addMember(member: MemberDto, res: Response) {
    try {
      const newMember = await this.memberRepository.addMember(member);
      const response = {message: 'success add member', data: newMember};
      return res.status(HttpStatus.CREATED).json(response);
    } catch (e) {
      console.log(e)
      throw new HttpException({
        message: e.message, error: e.statusCode
      }, e.statusCode)
    }
  }

  async addMembers(member: MemberDto[], res: Response) {
    try {
      const members = await this.memberRepository.addMembers(member);
      const response = {message: 'success add member', data: members};
      return res.status(HttpStatus.CREATED).json(response);
    } catch (e) {
      console.log(e)
      throw new HttpException({
        message: e.message, error: e.statusCode
      }, e.statusCode)
    }
  }

  async detailMember(res: Response) {
    try {
      const {borrowedBooks} = await this.bookrepository.existingBooks()
      const allMembers = await this.memberRepository.allMembers()
      const detailMember = allMembers.map((member) => {
        const detailPerMember = {
          _id: member._id,
          name: member.name,
          penalty_status: member.penalty_status,
          penalty_end_date: member.penalty_end_date,
          borrowedBooks: 0
        }
        borrowedBooks.forEach((borrowed) => {
          // @ts-ignore
          if (member.name === borrowed.member) {
            detailPerMember.borrowedBooks += 1
          }
        })
        return detailPerMember
      })
      res.status(200).json({message: 'success get detail member', data: detailMember})
    } catch (e) {
      console.log(e)
      throw new HttpException({
        message: e.message, error: e.statusCode
      }, e.statusCode)
    }
  }
}
