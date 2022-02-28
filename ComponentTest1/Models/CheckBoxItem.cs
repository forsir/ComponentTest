namespace ComponentTest1.Models
{
    public class CheckBoxItem : Item
    {
        public CheckBoxItem(string description, bool value) : base(description, 2)
        {
            State = new { Description = description, Value = value };
        }
    }
}
