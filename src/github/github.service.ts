import { Inject, Injectable } from '@nestjs/common';
import { createClient } from '@astrajs/collections';

import { CreateGithubDto } from './dto/create-github.dto';
import { UpdateGithubDto } from './dto/update-github.dto';

@Injectable()
export class GithubService {
  private collection;

  constructor(@Inject('DATASTAX') private datastax: createClient) {
    this.collection = this.datastax.namespace('eddiehub').collection('github');
  }

  create(createGithubDto: CreateGithubDto) {
    return this.collection.create('test', {
      name: 'test',
    });
  }

  findAll() {
    return this.collection.find();
  }

  findOne(id: number) {
    return this.collection.get('test');
  }

  update(id: number, updateGithubDto: UpdateGithubDto) {
    return `This action updates a #${id} github`;
  }

  remove(id: number) {
    return `This action removes a #${id} github`;
  }
}
