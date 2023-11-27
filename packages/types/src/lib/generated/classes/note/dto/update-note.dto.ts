
import {Type} from 'class-transformer'
import {IsOptional,IsString,Length} from 'class-validator'
import {ApiProperty} from '@nestjs/swagger'




export class UpdateNoteDto {
  @ApiProperty({
  description: `The note title`,
  example: `My note`,
  maxLength: 40,
  minLength: 3,
})
@IsOptional()
@IsString()
@Length(3, 40)
title?: string;
@ApiProperty({
  description: `The note body`,
  example: `This is my note`,
  maxLength: 200,
  minLength: 3,
})
@IsOptional()
@IsString()
@Length(3, 200)
body?: string;
}
