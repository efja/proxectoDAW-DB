// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import HttpStatus from 'http-status-codes';
import { QueryOrder, Reference, wrap, Utils } from '@mikro-orm/core';
import { Operation } from 'fast-json-patch';
import * as jsonpatch from 'fast-json-patch';

import { DBConnection } from '../config/config-db';
import { AssignedUser } from '../models/assigned-user.model';
import { User } from '../models/user.model';
import { getEntityForUpdate } from '../helpers/entity-construct.helper';

// ####################################################################################################
// ## CLASE AssignedUserService
// ####################################################################################################
export class AssignedUserService {
  // ************************************************************************************************
  // ** ATRIBUTOS
  // ************************************************************************************************
  private db          : DBConnection;
  private respository : any;

  // ************************************************************************************************
  // ** CONSTRUTOR
  // ************************************************************************************************
  constructor() {
    this.createDbConnection();
  }

  // ************************************************************************************************
  // ** MÉTODOS CONEXIÓN BD
  // ************************************************************************************************
  private async createDbConnection() {
    this.db = new DBConnection();

    await this.db.init();
    this.respository = this.db.getRepository(AssignedUser);
  }

  // ************************************************************************************************
  // ** MÉTODOS CRUD (CREACIÓN)
  // ************************************************************************************************
  // ------------------------------------------------------------------------------------------------
  // -- POST
  // ------------------------------------------------------------------------------------------------
  public async create(assignedUser: AssignedUser): Promise<any> {
    let result : any = HttpStatus.CONFLICT;

    try {
      let temp = null;

      // Comprobase que non exista a entidade na BD
      if (assignedUser.id != null) {
        temp = await this.respository.findOne(assignedUser.id);
      }

      if (temp == null) {
        temp = new AssignedUser();
        wrap(temp).assign(assignedUser, { em: this.db.orm.em });

        await this.respository.persist(temp).flush();

        result = temp;
      }
    } catch (error) {
      result = null;
    }
    return result;
  }

  public async createList(assignedUsers: AssignedUser[]): Promise<any> {
    let result : any = HttpStatus.CONFLICT;

    try {
      let temp = null;
      let assignedUserIds = null;

      // Búscase se os obxectos pasados teñen definido o ID
      for (let assignedUser of assignedUsers) {
        if (assignedUser.id != null) {
          if (assignedUserIds == null) {
            assignedUserIds = [];
          }

          assignedUserIds.push(assignedUser.id);
        }
      }

      // Comprobase que non existan as entidades na BD
      if (assignedUserIds != null) {
        temp = await this.respository.find(assignedUserIds);
      }

      if (temp == null || temp.length == 0) {
        await this.respository.persistAndFlush(assignedUsers);
        result = assignedUsers;
      }
    } catch (error) {
      result = null;
    }

    return result;
  }

  // ************************************************************************************************
  // ** MÉTODOS CRUD (READ)
  // ************************************************************************************************
  // ------------------------------------------------------------------------------------------------
  // -- GET
  // ------------------------------------------------------------------------------------------------
  public async getAll(
    filters?: any,
    orderBy = { name: QueryOrder.ASC },
    limit: number = 0,
    offset: number = 0
  ): Promise<any> {
    let result : any = HttpStatus.NOT_FOUND;

    try {
      result = await this.respository.find(filters, orderBy, limit, offset);

      if (result.length == 0) {
        result = HttpStatus.NOT_FOUND;
      }

    } catch (error) {
      result = null;
    }

    return result;
  }

  public async get(id: string, filters?: any): Promise<any> {
    let result : any = HttpStatus.NOT_FOUND;

    try {
      result = await this.respository.findOne({ id, ...filters });
    } catch (error) {
      result = null;
    }

    return result;
  }

  // ************************************************************************************************
  // ** MÉTODOS CRUD (UPDATE)
  // ************************************************************************************************
  // ------------------------------------------------------------------------------------------------
  // -- PUT
  // ------------------------------------------------------------------------------------------------
  public async update(id: string, assignedUser: AssignedUser): Promise<any> {
    let result : any = HttpStatus.NOT_FOUND;

    try {
      let temp = null;

      // Comprobase que non exista a entidade na BD
      if (id != null) {
        temp = await this.respository.findOne(id);
      }

      if (temp != null) {
        try {
          let updateData = await getEntityForUpdate(assignedUser, 'AssignedUser');

          if (updateData != null) {
            // Gárdanse os cambios na entidade
            temp.assign(updateData, { em: this.db.orm.em });

            // Actualizase a informanción na BD
            await this.respository.flush(temp);

            result = temp;
          }
        } catch (error) {
          result = HttpStatus.CONFLICT;
        }
      }
    } catch (error) {
      result = null;
    }

    return result;
  }

  // ------------------------------------------------------------------------------------------------
  // -- PATCH
  // ------------------------------------------------------------------------------------------------
  public async modify(id: string, objPatch: Operation[]): Promise<any> {
    let result : any = HttpStatus.NOT_FOUND;

    try {
      let temp = null;

      // Comprobase que non exista a entidade na BD
      if (id != null) {
        temp = await this.respository.findOne(id);
      }

      if (temp != null) {
        try {
          // Comprobase que o JSONPatch sexa correcto
          let testPatch = jsonpatch.validate(objPatch, temp);

          // Se o validador non produce resultados daquela o JSONPatch é correcto
          if (testPatch == undefined) {
            // Aplicase o JSONPatch
            jsonpatch.applyPatch(temp, objPatch);

            // Persístese a información na base de datos
            result = await this.update(id, temp);
          } else {
            result = HttpStatus.CONFLICT;
          }
        } catch (error) {
          result = HttpStatus.CONFLICT;
        }
      }
    } catch (error) {
      result = null;
    }

    return result;
  }

  // ************************************************************************************************
  // ** MÉTODOS CRUD (DELETE)
  // ************************************************************************************************
  // ------------------------------------------------------------------------------------------------
  // -- DELETE
  // ------------------------------------------------------------------------------------------------
  public async delete(id: string): Promise<any> {
    let result : any = HttpStatus.NOT_FOUND;

    try {
      let temp = null;

      // Comprobase que non exista a entidade na BD
      if (id != null) {
        temp = await this.respository.findOne(id);
      }

      if (temp != null) {
        try {
          // Borrase a informanción na BD
          await this.respository.remove(temp).flush();;

          result = temp;
        } catch (error) {
          result = HttpStatus.CONFLICT;
        }
      }
    } catch (error) {
      result = null;
    }

    return result;
  }
}
