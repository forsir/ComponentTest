namespace ComponentTest1.Models
{
    public class Tabs
    {
        public IList<ListPage> Lists { get; set; }

        public Tabs(IList<ListPage> items)
        {
            Lists = items;
        }
    }
}
