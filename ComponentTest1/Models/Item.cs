namespace ComponentTest1.Models
{
    public class Item
    {
        public object State { get; set; }

        public Item(string text)
        {
            State = new { Description = text };
        }
    }
}
