import {UserFullName} from "../../shared/types/user-full-name.interface";

export interface AuthorizedUser {
  id: string;
  fullName: UserFullName;
}
