namespace ComponentTest1.Models
{
    public class TextItem : Item
    {
        public TextItem(string description, string value) : base(description, 1)
        {
            State = new { Description = description, Value = value };
        }
    }
}
