param(
    [Parameter(Mandatory=$true)][string]$RootDir,
    [Parameter(Mandatory=$true)][string]$LabelsPath
)
$ErrorActionPreference = 'Stop'

$pagesDir = Join-Path $RootDir "astro\src\pages"
$zhDir = Join-Path $pagesDir "zh-TW"
$dataDir = Join-Path $RootDir "astro\src\data"

function Get-ConstValue($name, $text) {
    $m = [regex]::Match($text, "(?m)^const $name = (.+);$")
    if ($m.Success) { return $m.Groups[1].Value }
    return $null
}
function ParseJsonStr($raw) {
    if ($null -eq $raw) { return $null }
    try { return ($raw | ConvertFrom-Json) } catch { return $raw }
}

$labelsGlobal = Get-Content $LabelsPath -Raw -Encoding UTF8 | ConvertFrom-Json

# build lookup: project id (filename without .astro) -> {h1Main, h1Sub, client}
$zhLookup = @{}
Get-ChildItem $zhDir -Filter "project-*.astro" | ForEach-Object {
    $key = $_.BaseName
    $text = Get-Content $_.FullName -Raw -Encoding UTF8
    $h1Main = ParseJsonStr (Get-ConstValue "h1Main" $text)
    $h1Sub = ParseJsonStr (Get-ConstValue "h1Sub" $text)
    $metaFieldsV = ParseJsonStr (Get-ConstValue "metaFields" $text)
    $client = ""
    if ($metaFieldsV) {
        foreach ($f in $metaFieldsV) { if ($f.label -eq $labelsGlobal.client) { $client = $f.value } }
    }
    $zhLookup[$key] = [PSCustomObject]@{ H1Main = $h1Main; H1Sub = $h1Sub; Client = $client }
}

# category label EN -> ZH map (only the 5 filterable ones); keep other tags as-is (internal, not shown to users)
$catMap = @{
    'All Works' = $labelsGlobal.catAll
    'Exhibition Design' = $labelsGlobal.catExhibition
    'Interior Design' = $labelsGlobal.catInterior
    'Visual Design' = $labelsGlobal.catVisual
    'Event' = $labelsGlobal.catEvent
}

function Esc-Js($s) {
    if ($null -eq $s) { return "" }
    $s = $s -replace '\\', '\\\\'
    $s = $s -replace '"', '\"'
    return $s
}

function Translate-Cat($cat) {
    if ($catMap.ContainsKey($cat)) { return $catMap[$cat] }
    return $cat
}

$enText = Get-Content (Join-Path $dataDir "portfolio.ts") -Raw -Encoding UTF8

# --- heroSlides ---
$heroM = [regex]::Match($enText, "(?s)export const heroSlides: HeroSlide\[\] = \[(.*?)\n\];")
$heroBody = $heroM.Groups[1].Value
$heroEntries = [regex]::Matches($heroBody, "\{[^\n]+\}")
$heroLines = New-Object System.Collections.Generic.List[string]
foreach ($m in $heroEntries) {
    $obj = $m.Value | ConvertFrom-Json
    $hrefKey = $obj.href -replace '^\./', ''
    $zh = $zhLookup[$hrefKey]
    $titleZh = if ($zh) { $zh.H1Main } else { $obj.title }
    $subZh = if ($zh) { $zh.H1Sub } else { $obj.subtitle }
    $catZh = Translate-Cat $obj.category
    $line = "  { num: `"$($obj.num)`", category: `"$(Esc-Js $catZh)`", title: `"$(Esc-Js $titleZh)`", subtitle: `"$(Esc-Js $subZh)`", href: `"$($obj.href)`", realImg: `"$($obj.realImg)`", alt: `"$(Esc-Js $obj.alt)`" },"
    $heroLines.Add($line)
}

# --- projects ---
$projM = [regex]::Match($enText, "(?s)export const projects: Project\[\] = \[(.*?)\n\];")
$projBody = $projM.Groups[1].Value
$projEntries = [regex]::Matches($projBody, "\{[^\n]+\}")
$projLines = New-Object System.Collections.Generic.List[string]
$missingCount = 0
foreach ($m in $projEntries) {
    $obj = $m.Value | ConvertFrom-Json
    $hrefKey = $obj.href -replace '^\./', ''
    $zh = $zhLookup[$hrefKey]
    if (-not $zh) { $missingCount++ }
    $titleZh = if ($zh -and -not [string]::IsNullOrWhiteSpace($zh.H1Main)) { $zh.H1Main } else { $obj.title }
    $subZh = if ($zh -and -not [string]::IsNullOrWhiteSpace($zh.H1Sub)) { $zh.H1Sub } else { $obj.subtitle }
    $metaZh = if ($zh -and -not [string]::IsNullOrWhiteSpace($zh.Client)) { $zh.Client } else { $obj.meta }
    $catsZh = @($obj.categories | ForEach-Object { Translate-Cat $_ })
    $catsJs = "[" + (($catsZh | ForEach-Object { "`"$(Esc-Js $_)`"" }) -join ", ") + "]"
    $thumbPart = ""
    if ($obj.PSObject.Properties.Name -contains 'thumbImg') { $thumbPart = ", thumbImg: `"$($obj.thumbImg)`"" }
    $line = "  { id: `"$($obj.id)`", num: `"$($obj.num)`", title: `"$(Esc-Js $titleZh)`", categories: $catsJs, subtitle: `"$(Esc-Js $subZh)`", year: `"$($obj.year)`", href: `"$($obj.href)`", realImg: `"$($obj.realImg)`"$thumbPart, meta: `"$(Esc-Js $metaZh)`", alt: `"$(Esc-Js $obj.alt)`" },"
    $projLines.Add($line)
}

$catValues = @($labelsGlobal.catAll, $labelsGlobal.catExhibition, $labelsGlobal.catInterior, $labelsGlobal.catVisual, $labelsGlobal.catEvent)
$catValuesJs = "[" + (($catValues | ForEach-Object { "`"$(Esc-Js $_)`"" }) -join ", ") + "]"

$output = @"
export interface HeroSlide {
  num: string;
  category: string;
  title: string;
  subtitle: string;
  href: string;
  realImg: string;
  alt: string;
}

export interface Project {
  id: string;
  num: string;
  title: string;
  categories: string[];
  subtitle: string;
  year: string;
  href: string;
  realImg: string;
  thumbImg?: string;
  alt: string;
}

export const heroSlides: HeroSlide[] = [
$([string]::Join("`n", $heroLines))
];

export const categories = $catValuesJs;

export const projects: Project[] = [
$([string]::Join("`n", $projLines))
];
"@

$outPath = Join-Path $dataDir "portfolio-zh.ts"
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($outPath, $output, $utf8NoBom)
Write-Output "Written: $outPath"
Write-Output "Hero slides: $($heroLines.Count)"
Write-Output "Projects: $($projLines.Count)"
Write-Output "Projects missing zh lookup (used EN fallback): $missingCount"
