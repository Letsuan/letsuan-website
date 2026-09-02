param(
    [Parameter(Mandatory=$true)][string]$RootDir
)
$ErrorActionPreference = 'Stop'
$pfPath = Join-Path $RootDir "astro\src\data\portfolio-zh.ts"
$pagesDir = Join-Path $RootDir "astro\src\pages\zh-TW"

function Get-ConstValue($name, $text) {
    $m = [regex]::Match($text, "(?m)^const $name = (.+);$")
    if ($m.Success) { return $m.Groups[1].Value }
    return $null
}
function Esc-Js($s) {
    if ($null -eq $s) { return "" }
    $s = $s -replace '\\', '\\\\'
    $s = $s -replace '"', '\"'
    return $s
}
function Normalize-Src($s) {
    return ($s -replace '^\.\./', './')
}

$pfText = Get-Content $pfPath -Raw -Encoding UTF8

# Build src -> zh alt lookup across ALL zh-TW project pages
$srcToAlt = @{}
Get-ChildItem $pagesDir -Filter "project-*.astro" | ForEach-Object {
    $text = Get-Content $_.FullName -Raw -Encoding UTF8
    $imagesRaw = Get-ConstValue "images" $text
    if ($imagesRaw) {
        $images = $imagesRaw | ConvertFrom-Json
        foreach ($img in $images) {
            $key = Normalize-Src $img.src
            if (-not $srcToAlt.ContainsKey($key)) { $srcToAlt[$key] = $img.alt }
        }
    }
}

# --- Fix project card alts ---
$projRawMatch = [regex]::Match($pfText, "(?s)(export const projects: Project\[\] = \[)(.*?)(\n\];)")
$projBody = $projRawMatch.Groups[2].Value
$entries = [regex]::Matches($projBody, "\{[^\n]+\}")
$newProjLines = New-Object System.Collections.Generic.List[string]
$notFound = New-Object System.Collections.Generic.List[string]
foreach ($m in $entries) {
    $obj = $m.Value | ConvertFrom-Json
    $key = Normalize-Src $obj.realImg
    if ($srcToAlt.ContainsKey($key)) {
        $altZh = $srcToAlt[$key]
    } else {
        $notFound.Add("$($obj.id): $($obj.realImg)")
        $altZh = $obj.alt
    }
    $thumbPart = ""
    if ($obj.PSObject.Properties.Name -contains 'thumbImg') { $thumbPart = ", `"thumbImg`": `"$(Esc-Js $obj.thumbImg)`"" }
    $catsJs = "[" + (($obj.categories | ForEach-Object { "`"$(Esc-Js $_)`"" }) -join ", ") + "]"
    $line = "  { id: `"$(Esc-Js $obj.id)`", num: `"$($obj.num)`", title: `"$(Esc-Js $obj.title)`", categories: $catsJs, subtitle: `"$(Esc-Js $obj.subtitle)`", year: `"$($obj.year)`", href: `"$($obj.href)`", realImg: `"$($obj.realImg)`"$thumbPart, meta: `"$(Esc-Js $obj.meta)`", alt: `"$(Esc-Js $altZh)`" },"
    $newProjLines.Add($line)
}
$newProjBody = "`n" + [string]::Join("`n", $newProjLines)
$pfText = $pfText.Substring(0, $projRawMatch.Groups[2].Index) + $newProjBody + $pfText.Substring($projRawMatch.Groups[2].Index + $projRawMatch.Groups[2].Length)

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($pfPath, $pfText, $utf8NoBom)

Write-Output "Card alts updated: $($entries.Count)"
Write-Output "Not found (kept English, needs manual fix): $($notFound.Count)"
$notFound
