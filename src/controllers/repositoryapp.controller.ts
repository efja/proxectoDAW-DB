/* eslint-disable @typescript-eslint/no-explicit-any */
// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import HttpStatus from 'http-status-codes';
import { Operation } from 'fast-json-patch';
import { req, res, next } from 'express';
import qs from 'qs';

import { ResponseData } from '../interfaces/response-data.interface';
import { RepositoryAppService } from '../services/repositoryapp.service';
import { RepositoryApp } from '../models/repositoryapp.model';

// ####################################################################################################
// ## CLASE RepositoryAppController
// ####################################################################################################
export class RepositoryAppController {
  // ************************************************************************************************
  // ** ATRIBUTOS
  // ************************************************************************************************
  private TRANSLATION_NAME_MODEL : string = 'REPOSITORY';
  public repositoryAppService : RepositoryAppService = new RepositoryAppService();

  // ************************************************************************************************
  // ** CONSTRUTOR
  // ************************************************************************************************
  constructor() { }

  // ************************************************************************************************
  // ** MÉTODOS CRUD (CREACIÓN)
  // ************************************************************************************************
  /**
   * Crea un novo proxecto. (POST)
   *
   * @param req - obxecto da petición
   * @param res - obxecto da resposta
   * @param next
   */
  public create = async (
    req   : req,
    res   : res,
    next  : next
  ): Promise<any> => {
    try {
      let message;
      let error;
      let code = HttpStatus.CONFLICT;

      const repositoryApp: RepositoryApp = new RepositoryApp(req.body);

      let data;

      if (this.hasMinimumAttributes(repositoryApp)) {
        data = await this.repositoryAppService.create(repositoryApp);
      }

      if (
        data != undefined &&
        data != null &&
        data != HttpStatus.CONFLICT
      ) {
        code = HttpStatus.CREATED;
        message = req.t('SUCCESS.CREATE', { entity: req.t(`${this.TRANSLATION_NAME_MODEL}.NAME`) });
      } else if (data == HttpStatus.CONFLICT) {
        data = undefined;
        error = req.t('ERROR.ALREADY_EXIST', { entity: req.t(`${this.TRANSLATION_NAME_MODEL}.NAME`), id: repositoryApp.id });
      } else {
        data = undefined;
        error = req.t('ERROR.CREATE', { entity: req.t(`${this.TRANSLATION_NAME_MODEL}.NAME`) });
      }

      const responseData : ResponseData = {
        code,
        data,
        message,
        error,
      };

      res.status(code).json(responseData);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Crea os proxectos dunha dunha lista pasada. (POST)
   *
   * @param req - obxecto da petición
   * @param res - obxecto da resposta
   * @param next
   */
  public createList = async (
    req   : req,
    res   : res,
    next  : next
  ): Promise<any> => {
    try {
      let message;
      let error;
      let code = HttpStatus.CONFLICT;

      const repositoryApps: RepositoryApp[] = req.body;

      let data;
      let continueProcess: boolean = true;

      for (let i = 0; i < repositoryApps.length; i++) {
        let item = repositoryApps[i];

        if (this.hasMinimumAttributes(item)) {
          // Crease un proxecto novo para asegurar que vai a ser do tipo correcto
          repositoryApps[i] = new RepositoryApp(item);
        } else {
          continueProcess = false;
          break;
        }
      }

      if (continueProcess && repositoryApps && repositoryApps.length > 0) {
        data = await this.repositoryAppService.createList(repositoryApps);
      }

      if (
        data != undefined &&
        data != null &&
        data != HttpStatus.CONFLICT
      ) {
        code = HttpStatus.CREATED;
        message = req.t('SUCCESS.CREATE_LIST', { entity: req.t(`${this.TRANSLATION_NAME_MODEL}.NAME_PLURAL`) });
      } else if (data == HttpStatus.CONFLICT) {
        data = undefined;
        error = req.t('ERROR.ALREADY_EXIST_LIST', { entity: req.t(`${this.TRANSLATION_NAME_MODEL}.NAME_PLURAL`) });
      } else {
        data = undefined;
        error = req.t('ERROR.CREATE_LIST', { entity: req.t(`${this.TRANSLATION_NAME_MODEL}.NAME_PLURAL`) });
      }

      const responseData : ResponseData = {
        code    : code,
        data    : data,
        total   : (data && data.length) ? data.length : 0,
        from    : 0,
        limit   : 0,
        message : message,
        error   : error,
      };

      res.status(code).json(responseData);
    } catch (error) {
      next(error);
    }
  }

  // ************************************************************************************************
  // ** MÉTODOS CRUD (READ)
  // ************************************************************************************************
  /**
   * Recupera tódolos proxectos. (GET)
   *
   * @param req - obxecto da petición
   * @param res - obxecto da resposta
   * @param next
   */
  public getAll = async (
    req   : req,
    res   : res,
    next  : next
  ): Promise<any> => {
    try {
      let message;
      let error;
      let code = HttpStatus.NOT_FOUND;

      const {
        orderBy,
        limit,
        offset,
        ...query
      } = req.query

      const queryParams = qs.parse(query);

      let data = await this.repositoryAppService.getAll(queryParams, orderBy, limit, offset);

      if (
        data != undefined &&
        data != null &&
        data != HttpStatus.NOT_FOUND
      ) {
        code = HttpStatus.OK;
        message = req.t('SUCCESS.GET_LIST', { entity: req.t(`${this.TRANSLATION_NAME_MODEL}.NAME_PLURAL`) });
      } else {
        data = undefined;
        error = req.t('ERROR.NOT_FOUND_LIST', { entity: req.t(`${this.TRANSLATION_NAME_MODEL}.NAME_PLURAL`) });
      }

      const responseData : ResponseData = {
        code    : code,
        data    : data,
        total   : (data && data.length) ? data.length : 0,
        from    : 0,
        limit   : 0,
        message : message,
        error   : error,
      };

      res.status(code).json(responseData);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Recupera un proxecto en concreto. (GET)
   *
   * @param req - obxecto da petición
   * @param res - obxecto da resposta
   * @param next
   */
  public get = async (
    req   : req,
    res   : res,
    next  : next
  ): Promise<any> => {
    try {
      let code = HttpStatus.NOT_FOUND;
      let message;
      let error;

      const { id } = req.params;
      const queryParams = qs.parse(req.query);

      let data = await this.repositoryAppService.get(id, queryParams);

      if (
        data != undefined &&
        data != null &&
        data != HttpStatus.NOT_FOUND
      ) {
        code = HttpStatus.OK;
        message = req.t('SUCCESS.GET', { entity: req.t(`${this.TRANSLATION_NAME_MODEL}.NAME`) });
      } else {
        data = undefined;
        error = req.t('ERROR.NOT_FOUND', { entity: req.t(`${this.TRANSLATION_NAME_MODEL}.NAME`), id: id });
      }

      const responseData : ResponseData = {
        code,
        data,
        message,
        error,
      };

      res.status(code).json(responseData);
    } catch (error) {
      next(error);
    }
  };

  // ************************************************************************************************
  // ** MÉTODOS CRUD (UPDATE)
  // ************************************************************************************************
  /**
   * Actualiza un proxecto. (PUT)
   *
   * @param req - obxecto da petición
   * @param res - obxecto da resposta
   * @param next
   */
  public update = async (
    req   : req,
    res   : res,
    next  : next
  ): Promise<any> => {
    try {
      let message;
      let error;
      let code = HttpStatus.NOT_FOUND;

      const { id } = req.params;
      const repositoryApp: RepositoryApp = new RepositoryApp(req.body);

      let data;

      if (this.hasMinimumAttributes(repositoryApp)) {
        data = await this.repositoryAppService.update(id, repositoryApp);
      }

      if (
        data != undefined &&
        data != null &&
        data != HttpStatus.NOT_FOUND &&
        data != HttpStatus.CONFLICT
      ) {
        code = HttpStatus.CREATED;
        message = req.t('SUCCESS.UPDATE', { entity: req.t(`${this.TRANSLATION_NAME_MODEL}.NAME`), id: id });
      } else if (data == HttpStatus.CONFLICT) {
        code = HttpStatus.CONFLICT;
        data = undefined;
        error = req.t('ERROR.CONFLICT', { entity: req.t(`${this.TRANSLATION_NAME_MODEL}.NAME`), id: id });
      } else {
        data = undefined;
        error = req.t('ERROR.NOT_FOUND', { entity: req.t(`${this.TRANSLATION_NAME_MODEL}.NAME`), id: id });
      }

      const responseData : ResponseData = {
        code,
        data,
        message,
        error,
      };

      res.status(code).json(responseData);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Actualiza un proxecto. (PATCH)
   *
   * @param req - obxecto da petición
   * @param res - obxecto da resposta
   * @param next
   */
   public modify = async (
    req   : req,
    res   : res,
    next  : next
  ): Promise<any> => {
    try {
      let message;
      let error;
      let code = HttpStatus.NOT_FOUND;

      const { id } = req.params;
      const tempPatch: Operation[] = req.body;
      let objPatch: Operation[] = [];

      let data;

      if (tempPatch.length > 0) {
        // Quitanse as modficacións de ids.
        objPatch = tempPatch.filter(op => !op.path.includes("id"));
      }

      if (objPatch.length > 0) {

        data = await this.repositoryAppService.modify(id, objPatch);

        if (
          data != undefined &&
          data != null &&
          data != HttpStatus.NOT_FOUND &&
          data != HttpStatus.CONFLICT
        ) {
          code = HttpStatus.CREATED;
          message = req.t('SUCCESS.UPDATE', { entity: req.t(`${this.TRANSLATION_NAME_MODEL}.NAME`), id: id });
        } else if (data == HttpStatus.CONFLICT) {
          code = HttpStatus.CONFLICT;
          data = undefined;
          error = req.t('ERROR.CONFLICT', { entity: req.t(`${this.TRANSLATION_NAME_MODEL}.NAME`), id: id });
        } else {
          data = undefined;
          error = req.t('ERROR.NOT_FOUND', { entity: req.t(`${this.TRANSLATION_NAME_MODEL}.NAME`), id: id });
        }
      } else {
        code = HttpStatus.BAD_REQUEST;
        error = req.t('ERROR.BAD_REQUEST', { entity: req.t(`${this.TRANSLATION_NAME_MODEL}.NAME`) });
      }

      const responseData : ResponseData = {
        code,
        data,
        message,
        error,
      };

      res.status(code).json(responseData);
    } catch (error) {
      next(error);
    }
  };

  // ************************************************************************************************
  // ** MÉTODOS CRUD (DELETE)
  // ************************************************************************************************
  /**
   * Elimina un proxecto concreto. (DELETE)
   *
   * @param req - obxecto da petición
   * @param res - obxecto da resposta
   * @param next
   */
  public delete = async (
    req   : req,
    res   : res,
    next  : next
  ): Promise<any> => {
    try {
      let code = HttpStatus.NOT_FOUND;
      let message;
      let error;

      const { id } = req.params;

      let data = await this.repositoryAppService.delete(id);

      if (
        data != undefined &&
        data != null &&
        data != HttpStatus.CONFLICT &&
        data != HttpStatus.NOT_FOUND
      ) {
        code = HttpStatus.OK;
        message = req.t('SUCCESS.DELETE', { entity: req.t(`${this.TRANSLATION_NAME_MODEL}.NAME`), id: id });
      } else if (data == HttpStatus.CONFLICT) {
        code = HttpStatus.CONFLICT;
        data = undefined;
        error = req.t('ERROR.CONFLICT', { entity: req.t(`${this.TRANSLATION_NAME_MODEL}.NAME`), id: id });
      } else {
        data = undefined;
        error = req.t('ERROR.DELETE', { entity: req.t(`${this.TRANSLATION_NAME_MODEL}.NAME`), id: id });
      }

      const responseData : ResponseData = {
        code,
        data,
        message,
        error,
      };

      res.status(code).json(responseData);
    } catch (error) {
      next(error);
    }
  };

  // ************************************************************************************************
  // ** UTILIDADES
  // ************************************************************************************************
  /**
   * Comproba se o RepositoryApp pasado ten os atributos mínimos que o modelo necesita.
   *
   * @param item RepositoryApp que se vai a avaliar
   * @returns Boolean
   */
  private hasMinimumAttributes = (item: RepositoryApp): Boolean => {
    let result = false;

    if (
      item &&
      item.name &&
      item.uri
    ) {
      result = true;
    }

    return result;
  }
}
