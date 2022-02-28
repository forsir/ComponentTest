namespace ComponentTest1.Models
{
    public class CheckBoxItem : Item
    {
        public CheckBoxItem(string description, bool value) : base(description)
        {
            State = new { Description = description, Value = value };
        }
    }
}
