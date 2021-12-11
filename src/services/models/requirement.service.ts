// ##################################################################################################
// ## IMPORTACIÓNS
// ##################################################################################################
import { BaseService } from '../base.service';
import { Requirement } from '../../models/requirement.model';

// ##################################################################################################
// ## CLASE RequirementService
// ##################################################################################################
export class RequirementService extends BaseService<Requirement> {
  // ************************************************************************************************
  // ** ATRIBUTOS
  // ************************************************************************************************
  protected populate: string[] = [
    'dependencies',
    'assignedUsers',
    'createdBy',
    'visibleToUserGroups',
    'estimatedResources',
    'resourcesConsumed',
    'repositories',
    'assignedStage',
    'comments',
    'priority',
    'type',
  ];

  // ************************************************************************************************
  // ** CONSTRUTOR
  // ************************************************************************************************
  constructor() {
    super(Requirement)
  }

  // ************************************************************************************************
  // ** UTILIDADES
  // ************************************************************************************************
}
