import { ModulePermission } from '../enum/module.enum';
import { RolePermission } from '../enum/role.enum';
import { UserPermission } from '../enum/user.enum';
import { ResourcePermission } from '../enum/resource.enum';
import { MenuPermission } from '../enum/menu.enum';
import { SecuenciasPermission } from '../enum/secuencias';
import { PrecioPermission } from '../enum/precio.enum';
import { TicketPermission } from '../enum/ticket.enum';

const Permission = {
  ...UserPermission,
  ...RolePermission,
  ...ModulePermission,
  ...ResourcePermission,
  ...MenuPermission,
  ...SecuenciasPermission,
  ...PrecioPermission,
  ...TicketPermission
};

type Permission =
  | UserPermission
  | RolePermission
  | ModulePermission
  | ResourcePermission
  | MenuPermission
  | SecuenciasPermission
  | PrecioPermission | TicketPermission;

export default Permission;
