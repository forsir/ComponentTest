namespace ComponentTest1.Models
{
    public class SelectItem : Item
    {
        public SelectItem(string description) : base(description, 1)
        {
            State = new { Description = description };
        }
    }
}
