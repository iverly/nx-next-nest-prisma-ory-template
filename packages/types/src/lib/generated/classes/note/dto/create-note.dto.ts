
import {Type} from 'class-transformer'
import {IsNotEmpty,IsString,Length} from 'class-validator'
import {ApiProperty,getSchemaPath} from '@nestjs/swagger'




export class CreateNoteDto {
  @ApiProperty({
  description: `The note title`,
  example: `My note`,
  maxLength: 40,
  minLength: 3,
})
@IsNotEmpty()
@IsString()
@Length(3, 40)
title: string;
@ApiProperty({
  description: `The note body`,
  example: `This is my note`,
  maxLength: 200,
  minLength: 3,
})
@IsNotEmpty()
@IsString()
@Length(3, 200)
body: string;
}
