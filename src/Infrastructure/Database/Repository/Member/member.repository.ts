import {InjectModel} from "@nestjs/mongoose";
import {Member} from "../../../../Domain/Member/Model/member.schema";
import {Injectable, NotFoundException} from "@nestjs/common";
import {Model} from "mongoose";

@Injectable()
export class MemberRepository {
  constructor(@InjectModel(Member.name) private memberModel: Model<Member>) {}

  async addMember(member: Member): Promise<Member | null> {
    const addMember = new this.memberModel(member);
    return addMember.save()
  }

  async addMembers(members: Member[]): Promise<Member[] | null> {
    const addMember = await this.memberModel.insertMany(members);
    return addMember
  }

  async findMemberByName(name: any): Promise<Member | null> {
    const memberByName = await this.memberModel.findOne({
      name: name
    })
    if (!memberByName) throw new NotFoundException({message: 'member is not found'})
    return memberByName
  }

  async applyPenalty(name: any, penalty_end_date: any): Promise<Member | boolean> {
    await this.memberModel.updateOne({
      name: name
    }, {
      penalty_status: true,
      penalty_end_date: penalty_end_date
    })
    return true
  }

  async allMembers() {
    const allMembers = await this.memberModel.find()
    if (!allMembers) throw new NotFoundException({ message: 'there is no member' })
    return allMembers
  }
}
