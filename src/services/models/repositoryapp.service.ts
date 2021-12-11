// ##################################################################################################
// ## IMPORTACIÓNS
// ##################################################################################################
import { BaseService } from '../base.service';
import { RepositoryApp } from '../../models/repositoryapp.model';

// ##################################################################################################
// ## CLASE RepositoryAppService
// ##################################################################################################
export class RepositoryAppService extends BaseService<RepositoryApp> {
  // ************************************************************************************************
  // ** ATRIBUTOS
  // ************************************************************************************************
  protected populate: string[] = [
    'createdBy',
    'assignedUsers',
    'visibleToUserGroups',
    'comments',
  ];

  // ************************************************************************************************
  // ** CONSTRUTOR
  // ************************************************************************************************
  constructor() {
    super(RepositoryApp)
  }

  // ************************************************************************************************
  // ** UTILIDADES
  // ************************************************************************************************
}
