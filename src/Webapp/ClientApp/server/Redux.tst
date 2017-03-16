${
	using System.Text;

    Template(Settings settings)
    {
        settings
            .IncludeCurrentProject()
            .IncludeProject("GrainInterfaces");
		settings.OutputFilenameFactory = file => {
			string name = System.IO.Path.GetFileNameWithoutExtension(file.Name);
			if (name.StartsWith("I") && name.Length > 2 && Char.IsUpper(name[1]))
				name = name.Substring(1);
			if (name.EndsWith("Grain"))
				name = name.Substring(0, name.Length - 5);
			return name + ".ts";
		};
    }


	bool HasPayload(Class cls)
	{
		return cls.Properties.Any();
	}

	string ActionName(Class cls)
	{
		StringBuilder sb = new StringBuilder();

		string name = cls.name.Substring(0, cls.name.Length - 6); // remove 'Action'
        foreach (char c in name)
        {
            if (Char.IsUpper(c))
            {
                sb.Append("_");
            }
            sb.Append(Char.ToUpper(c));
        }
		return sb.ToString();
	}
}// This file is generated from template "Redux.tst" using typewriter
// it generates interface declarations for Actions and State that are implemented server-side

$Classes(*Action)[export const $ActionName = '$Name';
]
$Enums(e => e.Name == "Gender")[export enum $Name { $Values[
    $Name = $Value][,]
}
]
$Classes(*Action)[export interface $Name { 
	type: '$Name'; $HasPayload[
	payload: {$Properties[
		$name: $Type;]
	}][]
}

]
$Classes(c => c.Name.EndsWith("State"))[export interface $Name {$Properties[
	$name: $Type;]
}

]

