namespace ComponentTest1.Models
{
    public class TextItem : Item
    {
        public TextItem(string description, string value) : base(description)
        {
            State = new { Description = description, Value = value };
        }
    }
}
