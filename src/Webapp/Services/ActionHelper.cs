using GrainInterfaces;
using System;
using System.Text;

namespace Webapp.Services
{
    static class ActionHelper
    {
        public static IAction ConstructTypedAction(dynamic action)
        {
            if (action == null || action.type == null)
                return null;

            // TODO: action.type should not be trusted as it is external input; it should be validated
            // Our actions are always defined inside GrainInterfaces for now
            Type actionType = Type.GetType("GrainInterfaces." + action.type + ",GrainInterfaces");

            if (action.payload == null)
                return Activator.CreateInstance(actionType) as IAction;
            else
                return (IAction)Convert.ChangeType(action.payload, actionType);
        }

        public static string ActionName(string className)
        {
            StringBuilder sb = new StringBuilder();

            string name = className.Substring(0, className.Length - 6); // remove 'Action'
            bool first = true;
            foreach (char c in name)
            {
                if (Char.IsUpper(c) && !first)
                {
                    sb.Append("_");
                }
                sb.Append(Char.ToUpper(c));
                if (first) first = false;
            }
            return sb.ToString();
        }
    }
}
