using System;
using System.ComponentModel.DataAnnotations;
using System.Globalization;

namespace DataAnnotationsExtensions
{

    /// <summary>
    /// Specifies the minimum length of array/string data allowed in a property.
    /// </summary>
    [AttributeUsage(AttributeTargets.Property | AttributeTargets.Field | AttributeTargets.Parameter, AllowMultiple = false)]
    public class TextLengthAttribute : ValidationAttribute
    {
        /// <summary>
        /// Gets the maximum acceptable length of the string
        /// </summary>
        public int MaximumLength
        {
            get;
            private set;
        }

        /// <summary>
        /// Gets or sets the minimum acceptable length of the string
        /// </summary>
        public int MinimumLength
        {
            get;
            private set;
        }

        /// <summary>
        /// Constructor that accepts the maximum length of the string.
        /// </summary>
        /// <param name="maximumLength">The maximum length, inclusive.  It may not be negative.</param>
        public TextLengthAttribute(int minimumLength, int maximumLength)
            : base("StringLengthAttribute_ValidationError")
        {
            this.MaximumLength = maximumLength;
            this.MinimumLength = minimumLength;
            this.EnsureLegalLengths();
        }
        
        public override bool IsValid(object value)
        {
            // Check the lengths for legality
            this.EnsureLegalLengths();
            string val = value as string;
            if (val == null || val.Trim().Length == 0)
                return true;

            int length = val.Length;
            if (length == 0)
            {
                if (this.MinimumLength == 0)
                    return true;

                return false;
            }

            return length >= this.MinimumLength && length <= this.MaximumLength;

        }

        /// <summary>
        /// Override of <see cref="ValidationAttribute.FormatErrorMessage"/>
        /// </summary>
        /// <param name="name">The name to include in the formatted string</param>
        /// <returns>A localized string to describe the maximum acceptable length</returns>
        /// <exception cref="InvalidOperationException"> is thrown if the current attribute is ill-formed.</exception>
        public override string FormatErrorMessage(string name)
        {
            if (this.MinimumLength == 0)
            {
                return string.Format("字符长度不能超过{0}", this.MaximumLength);
            }

            if (this.MaximumLength == int.MaxValue)
            {
                return string.Format("字符长度最小是{0}", this.MinimumLength);
            }

            return string.Format("字符长度应该不小于{0}，不大于{1}", this.MinimumLength,this.MaximumLength);
        }

        /// <summary>
        /// Checks that MinimumLength and MaximumLength have legal values.  Throws InvalidOperationException if not.
        /// </summary>
        private void EnsureLegalLengths()
        {
            if (this.MaximumLength <= 0 || this.MinimumLength < 0)
            {
                throw new InvalidOperationException("MaximumLength必须大于0, MinimumLength 不能小于0!");
            }
            
            if (this.MaximumLength < this.MinimumLength)
            {
                throw new InvalidOperationException("MaximumLength 与 MinimumLength 设置了无效的范围!");
            }
        }
    }
}
