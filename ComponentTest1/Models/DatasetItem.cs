namespace ComponentTest1.Models
{
    public class DatasetItem : Item
    {
        public DatasetItem(string description, string value, IList<string> allowedValues) : base(description, 3)
        {
            State = new { Description = description, Value = value, AllowedValues = allowedValues };
        }
    }
}
