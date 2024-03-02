import {IsBoolean, IsDate, IsNotEmpty, IsNumber, IsString, ValidateIf} from 'class-validator';
import {Type} from "class-transformer";
import {ApiProperty} from "@nestjs/swagger";

export class BookDto {
  @IsString()
  code: string;

  @IsString()
  title: string;

  @IsString()
  author: string;

  @IsNumber()
  @Type(() => Number)
  stock: number;
}

export class BorrowedBookDto {
  @ApiProperty({ example: 'asd' })
  @IsNotEmpty()
  @IsString()
  book: string;

  @ApiProperty({ example: 'bryan' })
  @IsNotEmpty()
  @IsString()
  member: string;

  @ApiProperty({ example: new Date() })
  @IsNotEmpty()
  borrow_date: Date;

  // @ValidateIf((object, value) => value !== null)
  // return_date: any;

  // @IsBoolean()
  // penalty_applied: boolean;
}

export class ReturnBook {
  @ApiProperty({ example: 'asd' })
  @IsNotEmpty()
  @IsString()
  book: any;

  @ApiProperty({ example: 'bryan' })
  @IsNotEmpty()
  @IsString()
  member: any;
}
