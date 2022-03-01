namespace ComponentTest1.Models
{
    public class Page
    {
        public Header Header { get; set; }
        public ListPage? List { get; set; }

        public Tabs? Tabs { get; set; }

        public Page(string headerText, IList<ListPage> items)
        {
            Header = new Header(headerText);
            Tabs = new Tabs(items);
        }

        public Page(string headerText, IList<Item> items)
        {
            Header = new Header(headerText);
            List = new ListPage(items);
        }
    }
}
