${
    Template(Settings settings)
    {
        settings
            .IncludeCurrentProject()
            .IncludeProject("GrainInterfaces");

        // settings.OutputExtension = ".tsx";
    }

    string Inherit(Class c)
    {
        if (c.BaseClass!=null)
	        return " extends " + c.BaseClass.ToString();
          else
	         return  "";
    }

    string Imports(Class c)
    {
        List<string> neededImports = c.Properties
	        .Where(p => !p.Type.IsPrimitive && !c.TypeArguments.Any(arg => arg.Name == p.Type.Name) && p.Type.Name.TrimEnd('[',']') != c.Name)
	        .Select(p => "import { " + p.Type.Name.TrimEnd('[',']') + " } from './" + p.Type.Name.TrimEnd('[',']') + "';").ToList();
        if (c.BaseClass != null)
        { 
	        neededImports.Add("import { " + c.BaseClass.Name +" } from './" + c.BaseClass.Name + "';");
        }
        return String.Join("\n", neededImports.Distinct());
    }

    bool IsOptional(Property p) 
    { 
        return p.Attributes.Any(a => a.Name == "JsonProperty"); // assume only used for DefaultValueHandling = DefaultValueHandling.Ignore
    }
}// This file was generated from the Models.tst template
//
$Classes(c => c.Attributes.Any(a => a.Name == "JsonObject"))[
$Imports

export class $Name$TypeParameters $Inherit { $Properties[
    $name$IsOptional[?]: $Type;]
}
]
