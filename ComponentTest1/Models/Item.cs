namespace ComponentTest1.Models
{
    public class Item
    {
        public int Type { get; set; }

        public object State { get; set; }

        public Item(string text, int type)
        {
            State = new { Description = text };
            Type = type;
        }
    }
}
