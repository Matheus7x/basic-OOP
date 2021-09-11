export default function sympleTools()
{
  if (!Array.prototype.last)
  {
    Array.prototype.last =
      function()
      {
        return this[this.length - 1];
      };
  };
  if (!Object.prototype.innerHTMLChild)
  {
    Object.prototype.innerHTMLChild =
      function(html)
      {
        this.innerHTML=`${this.innerHTML}${html}`;
      };
  };
}
