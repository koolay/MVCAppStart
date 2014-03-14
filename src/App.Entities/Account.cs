using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using ServiceStack.DataAnnotations;

namespace App.Entities
{
    /// <summary>
    /// define table
    /// </summary>
    public class Account
    {
        [AutoIncrement]
        public int Id { get; set; }
        [Index(Unique = true)]
        public string UserName { get; set; }
        public string Password { get; set; }
        public string DisplayName { get; set; }
    }
}
