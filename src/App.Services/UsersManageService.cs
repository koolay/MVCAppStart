using System;
using System.Collections.Generic;
using System.Linq;
using ServiceStack.OrmLite;
using App.Entities;
using App.ServicesInterface;

namespace App.Services
{
    public class UsersManageService : AppServiceBase, IUsersManageService
    {
        public  List<Account> GetAllUsers()
        {
            var userList = this.Db.Select<Account>().OrderByDescending(c => c.Id).ToList();
            return userList;
        }

        public  void Delete(string id)
        {
            this.Db.DeleteById<Account>(id);         
        }

        public  EmRegisterStatus Register(Account newAccount)
        {
            if (this.Db.Count<Account>(c => c.UserName == newAccount.UserName) > 0)
            {
                return EmRegisterStatus.AccountExist;
            }
            else
            {
                try
                {
                    this.Db.Insert<Account>(new Account() { UserName = newAccount.UserName, Password = newAccount.Password, DisplayName=newAccount.DisplayName});
                    return EmRegisterStatus.Success;
                }
                catch (Exception ex)
                {
                    Logger.Error("insert account failed. ", ex);
                    return EmRegisterStatus.SysError;
                }
            }
            
        }
        
        public bool IsExistsUserName(string userName)
        {
            return this.Db.Count<Account>(c => c.UserName == userName) > 0;
        }


        public bool ChangeUserPassword(string userName, string newPassword)
        {
            if (this.IsExistsUserName(userName))
            {
                this.Db.Update<Account>("set Password='{0}' ".Params(newPassword), "where UserName='{1}'".Params(userName));
                return true;
            }
            return false;
        }
    }
}
