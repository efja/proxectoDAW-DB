/* eslint-disable @typescript-eslint/no-explicit-any */
// ##################################################################################################
// ## IMPORTACIÓNS
// ##################################################################################################
import { AssignedUserService } from '../services/assigned-user.service';
import { AssignedUser } from '../models/assigned-user.model';
import { BaseController } from './base.controller';

// ##################################################################################################
// ## CONSTANTES
// ##################################################################################################
const TRANSLATION_NAME_MODEL : string = 'ASSIGNED_USER';

// ##################################################################################################
// ## CLASE AssignedUserController
// ##################################################################################################
export class AssignedUserController extends BaseController<AssignedUser> {
  // ************************************************************************************************
  // ** ATRIBUTOS
  // ************************************************************************************************
  protected TRANSLATION_NAME_MODEL : string = TRANSLATION_NAME_MODEL;
  protected minimumAttributes      : string[] = [
    'assignedUser',
  ];

  // ************************************************************************************************
  // ** CONSTRUTOR
  // ************************************************************************************************
  constructor() {
    super(AssignedUser, AssignedUserService)
  }

  // ************************************************************************************************
  // ** UTILIDADES
  // ************************************************************************************************
}
