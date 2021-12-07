// ##################################################################################################
// ## IMPORTACIÓNS
// ##################################################################################################
import { BaseService } from './base.service';
import { AssignedStage } from '../models/assigned-stage.model';

// ##################################################################################################
// ## CLASE AssignedStageService
// ##################################################################################################
export class AssignedStageService extends BaseService<AssignedStage> {
  // ************************************************************************************************
  // ** ATRIBUTOS
  // ************************************************************************************************

  // ************************************************************************************************
  // ** CONSTRUTOR
  // ************************************************************************************************
  constructor() {
    super(AssignedStage)
  }

  // ************************************************************************************************
  // ** UTILIDADES
  // ************************************************************************************************
}
