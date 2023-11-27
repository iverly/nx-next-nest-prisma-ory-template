import {
  Body,
  Controller,
  NotFoundException,
  Param,
  Req,
  RequestMethod,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiRouteAuthenticated } from '@nx-next-nest-prisma-ory-template/utils';
import { NotesService } from './notes.service';
import { FastifyRequest } from 'fastify';
import {
  CreateNoteDto,
  Note,
  NoteDto,
  UpdateNoteDto,
} from '@nx-next-nest-prisma-ory-template/types';

@ApiTags('Notes')
@Controller('notes')
export class NotesController {
  constructor(private notesService: NotesService) {}

  @ApiRouteAuthenticated({
    method: RequestMethod.POST,
    operation: {
      summary: 'Create a note',
      description: 'Create a new note with the given name and type',
    },
    response: {
      status: 201,
      type: NoteDto,
    },
  })
  create(
    @Body() body: CreateNoteDto,
    @Req() request: FastifyRequest
  ): Promise<NoteDto> {
    return this.notesService.create(body, request.user.sub);
  }

  @ApiRouteAuthenticated({
    method: RequestMethod.GET,
    operation: {
      summary: 'List all notes',
      description: 'Returns the list of all notes (limited to 1000)',
    },
    response: {
      status: 200,
      schema: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'The note id',
              example: 'b1774d2f-05f7-4ea4-b427-0d808bdca583',
            },
            title: {
              type: 'string',
              description: 'The note title',
              example: 'My note',
            },
            body: {
              type: 'string',
              description: 'The note body',
              example: 'This is the body of my note',
            },
            createdAt: {
              type: 'string',
              description: 'The note creation date',
              example: '2021-03-11T20:43:06.000Z',
            },
          },
        },
      },
    },
  })
  async list(@Req() request: FastifyRequest): Promise<Note[]> {
    const notes = await this.notesService.list(request.user.sub);

    if (!notes) {
      throw new NotFoundException();
    }

    return notes;
  }

  @ApiRouteAuthenticated({
    method: RequestMethod.GET,
    path: ':noteId',
    operation: {
      summary: 'Get a specific note',
      description: 'Returns the note with the given id',
    },
    response: {
      status: 200,
      type: NoteDto,
    },
  })
  async get(@Param('noteId') noteId: string): Promise<NoteDto> {
    const note = await this.notesService.get(noteId);

    if (!note) {
      throw new NotFoundException();
    }

    return note;
  }

  @ApiRouteAuthenticated({
    method: RequestMethod.PATCH,
    path: ':noteId',
    operation: {
      summary: 'Update a specific note',
      description: 'Updates the note with the given id',
    },
    response: {
      status: 200,
      type: NoteDto,
    },
  })
  async patch(
    @Body() body: UpdateNoteDto,
    @Param('noteId') noteId: string
  ): Promise<NoteDto> {
    const note = await this.notesService.patch(noteId, body);

    if (!note) {
      throw new NotFoundException();
    }

    return note;
  }

  @ApiRouteAuthenticated({
    method: RequestMethod.DELETE,
    path: ':noteId',
    operation: {
      summary: 'Delete a specific note',
      description: 'Deletes the note with the given id',
    },
    response: {
      status: 200,
      type: NoteDto,
    },
  })
  async delete(@Param('noteId') noteId: string): Promise<NoteDto> {
    const note = await this.notesService.delete(noteId);

    if (!note) {
      throw new NotFoundException();
    }

    return note;
  }
}
