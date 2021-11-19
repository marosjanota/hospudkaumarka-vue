$components = New-Object 'System.Collections.Generic.List[System.String]'

Get-ChildItem $PSScriptRoot -Filter *.vue -Recurse | % {
  $relativePathToComponent = $_.FullName.Replace($PSScriptRoot, "" ).Replace("\" , "/")
  $componentPath = "@/components$relativePathToComponent"
  $componentName = $([System.IO.Path]::GetFileNameWithoutExtension($_.Name))

  $components.Add("export { default as $componentName } from `"$componentPath`"")
}

Set-Content -Path "$PSScriptRoot/index.ts" -Value $components
