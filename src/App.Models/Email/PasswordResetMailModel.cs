using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace App.Models.Email
{
    public class PasswordResetMailModel
    {
        public string Receiver { get; set; }

        public string ActiveUrl { get; set; }

        public string Title { get; set; }

    }
}
