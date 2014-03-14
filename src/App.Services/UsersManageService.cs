using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using ServiceStack.OrmLite;
using App.Entities;
using App.ServicesInterface;

namespace App.Services
{
    public class UsersManageService : AppServiceBase, IUsersManageService
    {
        public  List<Account> GetAllUsers()
        {
            var userList = DBHelper.DB.Select<Account>().OrderByDescending(c => c.Id).ToList();
            return userList;
        }

        public  void Delete(string id)
        {
            DBHelper.DB.DeleteById<Account>(id);         
        }

        public  EmRegisterStatus Register(Account newAccount)
        {
            if (DBHelper.DB.Count<Account>(c => c.UserName == newAccount.UserName) > 0)
            {
                return EmRegisterStatus.AccountExist;
            }
            else
            {
                try
                {
                    DBHelper.DB.Insert<Account>(new Account() { UserName = newAccount.UserName, Password = newAccount.Password, DisplayName=newAccount.DisplayName});
                    return EmRegisterStatus.Success;
                }
                catch (Exception ex)
                {
                    Logger.Error("insert account failed. ", ex);
                    return EmRegisterStatus.SysError;
                }
            }
            
        }

    }
}
