namespace ComponentTest1.Models
{
    public class Header
    {
        public object State { get; set; }

        public Header(string text)
        {
            State = new { title = text };
        }
    }
}
