import { SetMetadata } from "@nestjs/common"
import { Rolesenum } from "../auth/roles.enum"

export const Roles = (...roles: Rolesenum[]) => SetMetadata("roles", roles)
