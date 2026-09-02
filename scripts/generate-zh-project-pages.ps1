param(
    [Parameter(Mandatory=$true)][string]$RootDir,
    [Parameter(Mandatory=$true)][string]$ReviewCsvPath,
    [Parameter(Mandatory=$true)][string]$LabelsPath
)
$ErrorActionPreference = 'Stop'

$pagesDir = Join-Path $RootDir "astro\src\pages"
$zhOutDir = Join-Path $pagesDir "zh-TW"
if (-not (Test-Path $zhOutDir)) { New-Item -ItemType Directory -Path $zhOutDir | Out-Null }

$labels = Get-Content $LabelsPath -Raw -Encoding UTF8 | ConvertFrom-Json
$review = Import-Csv $ReviewCsvPath

$byPage = @{}
foreach ($row in $review) {
    if (-not $byPage.ContainsKey($row.Page)) { $byPage[$row.Page] = @{} }
    $byPage[$row.Page][$row.Field] = $row
}

function Get-ConstValue($name, $text) {
    $m = [regex]::Match($text, "(?m)^const $name = (.+);$")
    if ($m.Success) { return $m.Groups[1].Value }
    return $null
}
function ParseJsonStr($raw) {
    if ($null -eq $raw) { return $null }
    try { return ($raw | ConvertFrom-Json) } catch { return $raw }
}

function Split-HeaderLine($s) {
    $dash = [char]0x2013
    $parts = @($s -split $dash)
    $parts = @($parts | ForEach-Object { $_.Trim() })
    $type = $parts[0]
    $venue = $parts[$parts.Count - 1]
    if ($parts.Count -gt 2) {
        $year = ($parts[1..($parts.Count - 2)] -join $dash)
    } else {
        $year = ""
    }
    return [PSCustomObject]@{ Type = $type; Year = $year; Venue = $venue }
}

function Convert-BodyToHtml($plain) {
    if ([string]::IsNullOrWhiteSpace($plain)) { return "" }
    $normalized = $plain -replace "`r`n", "`n"
    $blocks = @([regex]::Split($normalized, "`n{2,}"))
    $htmlLines = New-Object System.Collections.Generic.List[string]
    foreach ($block in $blocks) {
        $block = $block.Trim()
        if ($block -eq "") { continue }
        $lines = @([regex]::Split($block, "`n") | ForEach-Object { $_.Trim() } | Where-Object { $_ -ne "" })
        if ($lines.Count -eq 0) { continue }

        function Test-EndPunct($line) {
            $cp = [int][char]$line[$line.Length - 1]
            return ($cp -eq 0x3002 -or $cp -eq 0xFF01 -or $cp -eq 0xFF1F -or $cp -eq 0x2E -or $cp -eq 0x21 -or $cp -eq 0x3F)
        }

        if ($lines.Count -eq 1) {
            $line = $lines[0]
            if (Test-EndPunct $line) {
                $htmlLines.Add("<p>$line</p>")
            } else {
                $htmlLines.Add("<h2>$line</h2>")
            }
        } else {
            $first = $lines[0]
            $startIdx = 0
            if (-not (Test-EndPunct $first) -and $first.Length -le 24) {
                $htmlLines.Add("<h2>$first</h2>")
                $startIdx = 1
            }
            for ($i = $startIdx; $i -lt $lines.Count; $i++) {
                $htmlLines.Add("<p>$($lines[$i])</p>")
            }
        }
    }
    $joined = [string]::Join("`n", $htmlLines)
    return $joined
}

function Esc-Js($s) {
    if ($null -eq $s) { return "" }
    $s = $s -replace '\\', '\\\\'
    $s = $s -replace '"', '\"'
    $s = $s -replace "`r`n", '\n'
    $s = $s -replace "`n", '\n'
    return $s
}

$projectFiles = Get-ChildItem $pagesDir -Filter "project-*.astro" | Sort-Object Name

$zhTitleLookup = @{}
foreach ($file in $projectFiles) {
    $pk = $file.BaseName
    if ($byPage.ContainsKey($pk) -and $byPage[$pk].ContainsKey("H1 Main")) {
        $zhTitleLookup[$pk] = $byPage[$pk]["H1 Main"].Chinese
    }
}

$emdash = [char]0x2014
$altFallbackCount = 0
$altTotalCount = 0
$genCount = 0
$skipped = New-Object System.Collections.Generic.List[string]

foreach ($file in $projectFiles) {
    $pk = $file.BaseName
    if (-not $byPage.ContainsKey($pk)) { $skipped.Add($pk); continue }
    $rowset = $byPage[$pk]

    $enText = Get-Content $file.FullName -Raw -Encoding UTF8
    $canonicalEn = ParseJsonStr (Get-ConstValue "canonical" $enText)
    $ogImage = ParseJsonStr (Get-ConstValue "ogImage" $enText)
    $relatedV = ParseJsonStr (Get-ConstValue "relatedProjects" $enText)
    $nextHrefV = ParseJsonStr (Get-ConstValue "nextHref" $enText)
    $imagesV = ParseJsonStr (Get-ConstValue "images" $enText)

    $h1MainZh = if ($rowset.ContainsKey("H1 Main")) { $rowset["H1 Main"].Chinese } else { "" }
    $h1SubZh = if ($rowset.ContainsKey("H1 Sub")) { $rowset["H1 Sub"].Chinese } else { "" }
    $clientZh = if ($rowset.ContainsKey("Meta: CLIENT")) { $rowset["Meta: CLIENT"].Chinese } else { "" }
    $locationZh = if ($rowset.ContainsKey("Meta: LOCATION")) { $rowset["Meta: LOCATION"].Chinese } else { "" }
    $yearZh = if ($rowset.ContainsKey("Meta: YEAR")) { $rowset["Meta: YEAR"].Chinese } else { "" }
    $yearEn = if ($rowset.ContainsKey("Meta: YEAR")) { $rowset["Meta: YEAR"].English } else { "" }
    if ([string]::IsNullOrWhiteSpace($yearZh)) { $yearZh = $yearEn }
    $categoryZh = if ($rowset.ContainsKey("Meta: CATEGORY")) { $rowset["Meta: CATEGORY"].Chinese } else { "" }
    $areaZh = ""
    $hasArea = $rowset.ContainsKey("Meta: AREA")
    if ($hasArea) {
        $areaZh = $rowset["Meta: AREA"].Chinese
        $areaEn = $rowset["Meta: AREA"].English
        if ([string]::IsNullOrWhiteSpace($areaZh)) { $areaZh = $areaEn }
    }
    $eyebrowLeftRaw = if ($rowset.ContainsKey("Eyebrow Left")) { $rowset["Eyebrow Left"].Chinese } else { "" }
    $bodyZhPlain = if ($rowset.ContainsKey("Body (full HTML)")) { $rowset["Body (full HTML)"].Chinese } else { "" }

    $split = Split-HeaderLine $eyebrowLeftRaw
    $eyebrowLeftZh = "$($split.Type) $emdash $($split.Year)"
    $eyebrowRightZh = $split.Venue

    $bodyHtmlZh = Convert-BodyToHtml $bodyZhPlain

    $titleZh = "Le Tsuan Design | $h1MainZh"
    $descZh = "$h1MainZh $emdash $h1SubZh"
    $canonicalZh = "https://letsuan.com/zh-TW/$pk"

    $metaFieldsList = New-Object System.Collections.Generic.List[string]
    $metaFieldsList.Add("{`"label`": `"$($labels.client)`", `"value`": `"$(Esc-Js $clientZh)`"}")
    $metaFieldsList.Add("{`"label`": `"$($labels.location)`", `"value`": `"$(Esc-Js $locationZh)`"}")
    $metaFieldsList.Add("{`"label`": `"$($labels.year)`", `"value`": `"$(Esc-Js $yearZh)`"}")
    if ($hasArea -and -not [string]::IsNullOrWhiteSpace($areaZh)) {
        $metaFieldsList.Add("{`"label`": `"$($labels.area)`", `"value`": `"$(Esc-Js $areaZh)`"}")
    }
    $metaFieldsList.Add("{`"label`": `"$($labels.category)`", `"value`": `"$(Esc-Js $categoryZh)`"}")
    $metaFieldsJs = "[" + ([string]::Join(", ", $metaFieldsList)) + "]"

    $relatedList = New-Object System.Collections.Generic.List[string]
    if ($relatedV) {
        foreach ($r in $relatedV) {
            $targetKey = $r.href -replace '^\./', ''
            $label = $r.label
            if ($zhTitleLookup.ContainsKey($targetKey) -and -not [string]::IsNullOrWhiteSpace($zhTitleLookup[$targetKey])) {
                $label = $zhTitleLookup[$targetKey]
            }
            $relatedList.Add("{`"href`": `"$(Esc-Js $r.href)`", `"label`": `"$(Esc-Js $label)`"}")
        }
    }
    $relatedJs = "[" + ([string]::Join(", ", $relatedList)) + "]"

    $imagesList = New-Object System.Collections.Generic.List[string]
    if ($imagesV) {
        $idx = 1
        foreach ($img in $imagesV) {
            $fieldKey = "Image Alt $idx ($($img.src))"
            $altZh = ""
            if ($rowset.ContainsKey($fieldKey)) {
                $altZh = $rowset[$fieldKey].Chinese
            }
            $altTotalCount++
            if ([string]::IsNullOrWhiteSpace($altZh)) {
                $altZh = $img.alt
                $altFallbackCount++
            }
            $newSrc = $img.src -replace '^\./', '../'
            $plainFlag = ""
            if ($img.PSObject.Properties.Name -contains 'plain' -and $img.plain) { $plainFlag = ", `"plain`": true" }
            $imagesList.Add("{`"src`": `"$(Esc-Js $newSrc)`", `"alt`": `"$(Esc-Js $altZh)`"$plainFlag}")
            $idx++
        }
    }
    $imagesJs = "[" + ([string]::Join(", ", $imagesList)) + "]"

    $nextHrefJs = if ($nextHrefV) { $nextHrefV } else { "./portfolio" }

    $jsonLd = "[organizationJsonLd, {`"@context`": `"https://schema.org`", `"@type`": `"CreativeWork`", `"name`": `"$(Esc-Js $h1MainZh)`", `"description`": `"$(Esc-Js $descZh)`", `"url`": `"$canonicalZh`", `"creator`": {`"@id`": `"https://letsuan.com/#organization`"}, `"image`": `"$ogImage`", `"author`": {`"@id`": `"https://letsuan.com/#organization`"}, `"datePublished`": `"$(Esc-Js $yearEn)`", `"isPartOf`": {`"@id`": `"https://letsuan.com/#website`"}}, {`"@context`": `"https://schema.org`", `"@type`": `"BreadcrumbList`", `"itemListElement`": [{`"@type`": `"ListItem`", `"position`": 1, `"name`": `"$($labels.home)`", `"item`": `"https://letsuan.com/zh-TW/`"}, {`"@type`": `"ListItem`", `"position`": 2, `"name`": `"$($labels.portfolioBreadcrumb)`", `"item`": `"https://letsuan.com/zh-TW/portfolio`"}, {`"@type`": `"ListItem`", `"position`": 3, `"name`": `"$(Esc-Js $h1MainZh)`", `"item`": `"$canonicalZh`"}]}]"

    $bodyHtmlJs = Esc-Js $bodyHtmlZh

    $content = @"
---
import ProjectLayout from '../../components/ProjectLayout.astro';
import { organizationJsonLd } from '../../data/organization';

const title = "$(Esc-Js $titleZh)";
const description = "$(Esc-Js $descZh)";
const canonical = "$canonicalZh";
const ogImage = "$ogImage";
const alternateHrefs = [
  { hreflang: "en", href: "$canonicalEn" },
  { hreflang: "zh-TW", href: canonical },
];
const jsonLd = $jsonLd;
const eyebrowLeft = "$(Esc-Js $eyebrowLeftZh)";
const eyebrowRight = "$(Esc-Js $eyebrowRightZh)";
const h1Main = "$(Esc-Js $h1MainZh)";
const h1Sub = "$(Esc-Js $h1SubZh)";
const metaFields = $metaFieldsJs;
const bodyHtml = "$bodyHtmlJs";
const relatedProjects = $relatedJs;
const nextHref = "$(Esc-Js $nextHrefJs)";
const images = $imagesJs;
---

<ProjectLayout
  title={title}
  description={description}
  canonical={canonical}
  ogImage={ogImage}
  jsonLd={jsonLd}
  eyebrowLeft={eyebrowLeft}
  eyebrowRight={eyebrowRight}
  h1Main={h1Main}
  h1Sub={h1Sub}
  metaFields={metaFields}
  bodyHtml={bodyHtml}
  relatedProjects={relatedProjects}
  nextHref={nextHref}
  images={images}
  lang="zh-TW"
  alternateHrefs={alternateHrefs}
  closeLabel="$($labels.close)"
  backLabel="$($labels.back)"
  nextLabel="$($labels.next)"
  homeLabel="$($labels.home)"
  relatedLabel="$($labels.related)"
  detailLabel="$($labels.detail)"
/>
"@

    $outFile = Join-Path $zhOutDir "$pk.astro"
    $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
    [System.IO.File]::WriteAllText($outFile, $content, $utf8NoBom)
    $genCount++
}

Write-Output "Generated: $genCount"
Write-Output "Skipped (no CSV data): $($skipped.Count)"
$skipped
Write-Output "Image alt total: $altTotalCount"
Write-Output "Image alt using English fallback (Chinese missing): $altFallbackCount"
