using System;
using System.Web.Mvc;
using System.ComponentModel.DataAnnotations;

namespace App.Models.Passport
{
    public class RegisterModel
    {
        [Required]
        [Display(Name = "User name")]
        [StringLength(50, MinimumLength = 3, ErrorMessage = "The {0} must be at least {2} characters long.")]
        public string UserName { get; set; }

        [Required]
        [Display(Name="DisplayName")]
        [StringLength(50, MinimumLength = 3, ErrorMessage="The {0} must be at least {2} characters long.")]
        public string DisplayName { get; set; }

        [Required]
        [StringLength(50, ErrorMessage = "The {0} must be at least {2} characters long.", MinimumLength = 6)]
        [DataType(DataType.Password)]
        [Display(Name = "Password")]
        public string Password { get; set; }

        [DataType(DataType.Password)]
        [Display(Name = "Confirm password")]
        [Compare("Password", ErrorMessage = "The password and confirmation password do not match.")]
        public string ConfirmPassword { get; set; }

    }
}
