using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using App.Entities;

namespace App.ServicesInterface
{
    public interface IUsersManageService
    {
        List<Account> GetAllUsers();

        void Delete(string id);

        EmRegisterStatus Register(Account newAccount);
    }
}
