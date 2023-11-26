import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  Configuration,
  CreateRelationshipBody,
  Relationship,
  RelationshipApi,
  RelationshipApiDeleteRelationshipsRequest,
  RelationshipApiGetRelationshipsRequest,
  Relationships,
} from '@ory/keto-client';

@Injectable()
export class KetoService {
  private readonly readConfiguration: Configuration;
  private readonly writeConfiguration: Configuration;

  private readonly readRelationshipApi: RelationshipApi;
  private readonly writeRelationshipApi: RelationshipApi;

  constructor(configService: ConfigService<Record<string, unknown>, true>) {
    this.readConfiguration = new Configuration({
      basePath: configService.get<string>('keto.readUrl'),
    });

    this.writeConfiguration = new Configuration({
      basePath: configService.get<string>('keto.writeUrl'),
    });

    this.readRelationshipApi = new RelationshipApi(this.readConfiguration);
    this.writeRelationshipApi = new RelationshipApi(this.writeConfiguration);
  }

  async createRelation(data: CreateRelationshipBody): Promise<Relationship> {
    const createdRelationship =
      await this.writeRelationshipApi.createRelationship({
        createRelationshipBody: data,
      });

    return createdRelationship.data;
  }

  async deleteRelation(
    params: RelationshipApiDeleteRelationshipsRequest
  ): Promise<void> {
    await this.writeRelationshipApi.deleteRelationships(params);
  }

  async getRelationships(
    params: RelationshipApiGetRelationshipsRequest
  ): Promise<Relationships> {
    const relationships = await this.readRelationshipApi.getRelationships(
      params
    );

    return relationships.data;
  }
}
