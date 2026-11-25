import { Injectable } from '@nestjs/common';
import type { AlumniProfile } from '../registration/registration.model';
import type { User } from '../users/user.model';
import { AccountModel, MyApplication } from './account.model';

// What GET /api/account returns. A section a role does not have is null.
export interface AccountPage {
  user: User;
  alumniProfile: AlumniProfile | null; // ALUMNI only
  applications: MyApplication[] | null; // ALUMNI and STUDENT only: the roles that may apply (DDD 4.9)
}

// The rules of the /account page (task 7, DDD.md 4.14): which of their own
// records each role sees. It only ever reads the logged-in user's rows.
@Injectable()
export class AccountService {
  constructor(private readonly accountModel: AccountModel) {}

  async page(user: User): Promise<AccountPage> {
    const canApply = user.role === 'ALUMNI' || user.role === 'STUDENT';
    const [alumniProfile, applications] = await Promise.all([
      user.role === 'ALUMNI' ? this.accountModel.findAlumniProfile(user.id) : null,
      canApply ? this.accountModel.findApplications(user.id) : null,
    ]);
    return { user, alumniProfile, applications };
  }
}
