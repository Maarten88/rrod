${
    Template(Settings settings)
    {
        settings
            .IncludeCurrentProject()
            .IncludeProject("GrainInterfaces");

        // settings.OutputExtension = ".tsx";
    }
}// This file was generated from the Models.tst template
//
$Classes(*Model)[
export interface $Name { $Properties[
    $name: $Type;]
}]
$Classes(*Result)[
export interface $Name { $Properties[
    $name: $Type;]
}]
