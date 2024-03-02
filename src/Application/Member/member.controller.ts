import {Controller, Get, Post, Put, Delete, Param, Body, NotFoundException, Res} from '@nestjs/common';
import {MemberService} from './member.service';
// import {MemberDto} from './dto/member.dto';
import {Response} from "express";

@Controller('member')
export class MemberController {
  constructor(private readonly memberService: MemberService) {
  }

  @Get('all')
  async detailMember(@Res() res: Response) {
    return this.memberService.detailMember(res)
  }

  /** to Insert or InsertMany Only **/

  // @Post()
  // async addMember(@Body() body: MemberDto, @Res() res: Response) {
  //   return this.memberService.addMember(body, res)
  // }

  // @Post('members')
  // async addMembers(@Body() body: MemberDto[], @Res() res: Response) {
  //   return this.memberService.addMembers(body, res)
  // }
}
