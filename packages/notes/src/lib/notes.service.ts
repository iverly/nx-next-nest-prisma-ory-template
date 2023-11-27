import { Injectable } from '@nestjs/common';
import {
  Transaction,
  TransactionStep,
} from '@nx-next-nest-prisma-ory-template/utils';
import { KetoService } from '@nx-next-nest-prisma-ory-template/auth';
import { PrismaService } from '@nx-next-nest-prisma-ory-template/database';
import {
  CreateNoteDto,
  Note,
  UpdateNoteDto,
} from '@nx-next-nest-prisma-ory-template/types';

@Injectable()
export class NotesService {
  constructor(private prisma: PrismaService, private keto: KetoService) {}

  /**
   * The `create` function creates a new note and associates it with a specified subject using a
   * transaction.
   * @param {CreateNoteDto} dto - The `dto` parameter is an object of type `CreateNoteDto` which contains
   * the data needed to create a new note. It likely includes properties such as `title` and `body` which
   * represent the title and content of the note.
   * @param {string} subject - The `subject` parameter is a string that represents the owner or creator
   * of the note. It is used to create a relation between the note and the owner in the `keto` service.
   * @returns a Promise that resolves to a Note object.
   */
  async create(dto: CreateNoteDto, subject: string): Promise<Note> {
    const transaction = new Transaction();

    let note: Note | null = null;

    transaction.addStep(
      new TransactionStep(
        async () => {
          note = await this.prisma.note.create({
            data: {
              title: dto.title,
              body: dto.body,
            },
          });
        },
        async () => {
          if (note) {
            await this.prisma.note.delete({
              where: {
                id: note.id,
              },
            });
          }
        }
      )
    );

    transaction.addStep(
      new TransactionStep(
        async () => {
          await this.keto.createRelation({
            namespace: 'notes',
            object: note?.id,
            relation: 'owner',
            subject_id: subject,
          });
        },
        () => null
      )
    );

    await transaction.commit();

    if (!note) {
      throw new Error('Failed to create project');
    }

    return note;
  }

  /**
   * The `list` function retrieves a list of notes associated with a specific subject
   * @param {string} subject - A string representing the unique identifier of the subject that you want
   * to retrieve notes for.
   * @returns The `list` function is returning a `Promise` that resolves to an array of `Note` objects.
   */
  async list(subject: string): Promise<Note[]> {
    const relationships = await this.keto.getRelationships({
      pageSize: 1000,
      namespace: 'notes',
      relation: 'owner',
      subjectId: subject,
    });

    if (!relationships.relation_tuples) {
      return [];
    }

    return this.prisma.note.findMany({
      where: {
        id: {
          in: relationships.relation_tuples?.map((r) => r.object),
        },
      },
    });
  }

  /**
   * The `get` function retrieves a note with a specific ID
   * @param {string} id - A string representing the unique identifier of the note that you want to
   * retrieve.
   * @returns The `get` function is returning a `Promise` that resolves to either a `Note` object or
   * `null`.
   */
  get(id: string): Promise<Note | null> {
    return this.prisma.note.findUnique({
      where: {
        id,
      },
    });
  }

  /**
   * The `update` function updates a note with a specific ID
   * @param {string} noteId - A string representing the unique identifier of the note that you want to
   * update.
   * @param {UpdateNoteDto} dto - The `dto` parameter is an object of type `UpdateNoteDto` which contains
   * the data needed to update a note. It likely includes properties such as `title` and `body` which
   * represent the title and content of the note.
   * @returns The `update` function is returning a `Promise` that resolves to a `Note` object.
   */
  patch(noteId: string, dto: UpdateNoteDto): Promise<Note> {
    return this.prisma.note.update({
      where: {
        id: noteId,
      },
      data: {
        title: dto.title,
        body: dto.body,
      },
    });
  }

  /**
   * The `delete` function deletes a note with a specific ID
   * @param {string} noteId - A string representing the unique identifier of the note that you want to
   * delete.
   * @returns The `delete` function is returning a `Promise` that resolves to a `Note` object.
   */
  async delete(noteId: string): Promise<Note> {
    const transaction = new Transaction();

    let note: Note | null = null;

    transaction.addStep(
      new TransactionStep(
        async () => {
          note = await this.prisma.note.delete({
            where: {
              id: noteId,
            },
          });
        },
        async () => {
          if (note) {
            await this.prisma.note.create({
              data: {
                id: note.id,
                title: note.title,
                body: note.body,
                createdAt: note.createdAt,
              },
            });
          }
        }
      )
    );

    transaction.addStep(
      new TransactionStep(
        async () => {
          await this.keto.deleteRelation({
            namespace: 'notes',
            object: noteId,
          });
        },
        () => null
      )
    );

    await transaction.commit();

    if (!note) {
      throw new Error('Failed to create note');
    }

    return note;
  }
}
