import {IsBoolean, IsNotEmpty, IsString} from 'class-validator';

export class MemberDto {
  @IsString()
  name: string;

  @IsBoolean()
  penalty_status: boolean;

  @IsNotEmpty()
  penalty_end_date: any;
}
