
import {ApiProperty} from '@nestjs/swagger'


export class NoteDto {
  @ApiProperty({
  description: `The note id`,
  example: `b1774d2f-05f7-4ea4-b427-0d808bdca583`,
})
id: string ;
@ApiProperty({
  description: `The note title`,
  example: `My note`,
  maxLength: 40,
  minLength: 3,
})
title: string ;
@ApiProperty({
  description: `The note body`,
  example: `This is my note`,
  maxLength: 200,
  minLength: 3,
})
body: string ;
@ApiProperty({
  description: `When the project was created`,
  type: `string`,
  format: `date-time`,
})
createdAt: Date ;
}
