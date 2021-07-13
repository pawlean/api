import { AstraService, deleteItem } from '@cahllagerfeld/nestjs-astra';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { StandupDTO } from './dto/standup.dto';
import { Standup, StandupConfig } from './interfaces/standup.interface';
import { catchError, concatMap, filter } from 'rxjs/operators';
import { Author } from '../auth/author-headers';
import { ValidationService } from '../auth/header-validation.service';
import { from } from 'rxjs';
import { BaseService } from '../commons/base.service';

@Injectable()
export class StandupService extends BaseService {
  constructor(
    readonly astraService: AstraService,
    private readonly validationService: ValidationService,
  ) {
    super(astraService);
  }

  create(body: StandupDTO) {
    const { author, todayMessage, yesterdayMessage } = body;

    const newStandup: Standup = {
      yesterdayMessage: yesterdayMessage,
      todayMessage: todayMessage,
      author: { ...author },
      createdOn: new Date(Date.now()),
    };

    return this.astraService.create<Standup>(newStandup).pipe(
      catchError(() => {
        throw new HttpException(
          'Creation didnt pass as expected',
          HttpStatus.BAD_REQUEST,
        );
      }),
    );
  }

  findAll() {
    return this.astraService.find<Standup>().pipe(catchError(() => from([{}])));
  }

  findById(id: string) {
    return this.astraService.get<Standup>(id).pipe(
      catchError(() => {
        throw new HttpException(
          `no standup for ${id} found`,
          HttpStatus.NOT_FOUND,
        );
      }),
    );
  }

  deleteStandup(id: string, authorObject: Author) {
    return this.astraService.get<Standup>(id).pipe(
      catchError(() => {
        throw new HttpException(
          `no standup for ${id} found`,
          HttpStatus.NOT_FOUND,
        );
      }),
      filter((data: Standup) => {
        if (!data) {
          throw new HttpException(
            `no standup for ${id} found`,
            HttpStatus.NOT_FOUND,
          );
        }

        if (
          !this.validationService.validateAuthor(
            data.author,
            authorObject.uid,
            authorObject.platform,
          )
        ) {
          throw new HttpException(
            "deletion failed: author doesn't match",
            HttpStatus.BAD_REQUEST,
          );
        }
        return true;
      }),
      concatMap(() =>
        this.astraService
          .delete(id)
          .pipe(filter((data: deleteItem) => data.deleted === true)),
      ),
    );
  }

  search(id: string) {
    if (!id) {
      throw new HttpException(
        'Please provide search context',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.astraService
      .find<Standup>({ 'author.uid': { $eq: id } })
      .pipe(
        catchError(() => {
          throw new HttpException(
            `no standup for ${id} found`,
            HttpStatus.NOT_FOUND,
          );
        }),
      );
  }
}
