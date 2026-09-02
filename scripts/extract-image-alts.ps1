param(
    [Parameter(Mandatory=$true)][string]$RootDir
)
$ErrorActionPreference = 'Stop'
$pagesDir = Join-Path $RootDir "astro\src\pages\zh-TW"

function Get-ConstValue($name, $text) {
    $m = [regex]::Match($text, "(?m)^const $name = (.+);$")
    if ($m.Success) { return $m.Groups[1].Value }
    return $null
}

$rows = New-Object System.Collections.Generic.List[object]
$files = Get-ChildItem $pagesDir -Filter "project-*.astro" | Sort-Object Name

foreach ($f in $files) {
    $text = Get-Content $f.FullName -Raw -Encoding UTF8
    $imagesRaw = Get-ConstValue "images" $text
    if ($null -eq $imagesRaw) { continue }
    $images = $imagesRaw | ConvertFrom-Json
    $i = 0
    foreach ($img in $images) {
        $rows.Add([PSCustomObject]@{
            Page = $f.BaseName
            Index = $i
            Src = $img.src
            Alt = $img.alt
        })
        $i++
    }
}

$outPath = Join-Path $RootDir "scripts\image-alts.csv"
$rows | Export-Csv -Path $outPath -NoTypeInformation -Encoding UTF8
Write-Output "Rows: $($rows.Count)"
Write-Output "Saved: $outPath"
