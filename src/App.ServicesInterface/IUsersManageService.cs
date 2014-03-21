using System;
using System.Collections.Generic;
using App.Entities;

namespace App.ServicesInterface
{
    public interface IUsersManageService
    {
        List<Account> GetAllUsers();

        void Delete(string id);

        bool ChangeUserPassword(string userName, string newPassword);

        EmRegisterStatus Register(Account newAccount);

        bool IsExistsUserName(string userName);
    }
}
