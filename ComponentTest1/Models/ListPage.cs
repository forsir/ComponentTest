namespace ComponentTest1.Models
{
    public class ListPage
    {
        public IList<Item> Items { get; set; }

        public ListPage(IList<Item> items)
        {
            Items = items;
        }
    }
}
