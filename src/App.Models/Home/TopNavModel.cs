using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using App.Entities;

namespace App.Models.Home
{
    public class TopNavModel
    {
        public bool IsLogined
        {
            get;
            set;
        }

        public Account UserInfo
        {
            get;
            set;
        }
    }
}
