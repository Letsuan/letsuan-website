param(
    [Parameter(Mandatory=$true)][string]$RootDir
)
$ErrorActionPreference = 'Stop'
$pagesDir = Join-Path $RootDir "astro\src\pages\zh-TW"
$zhPath = Join-Path $RootDir "scripts\image-alts-zh.json"

$zh = Get-Content $zhPath -Raw -Encoding UTF8 | ConvertFrom-Json

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

$updated = 0
$files = Get-ChildItem $pagesDir -Filter "project-*.astro" | Sort-Object Name

foreach ($f in $files) {
    $page = $f.BaseName
    $prop = $zh.PSObject.Properties[$page]
    if (-not $prop) {
        Write-Output "SKIP (no zh data): $page"
        continue
    }
    $altsZh = $prop.Value

    $text = Get-Content $f.FullName -Raw -Encoding UTF8
    $imagesRaw = Get-ConstValue "images" $text
    if ($null -eq $imagesRaw) {
        Write-Output "SKIP (no images const): $page"
        continue
    }
    $images = $imagesRaw | ConvertFrom-Json

    if ($images.Count -ne $altsZh.Count) {
        Write-Output "COUNT MISMATCH, skipping: $page (images=$($images.Count) zh=$($altsZh.Count))"
        continue
    }

    $entries = New-Object System.Collections.Generic.List[string]
    for ($i = 0; $i -lt $images.Count; $i++) {
        $img = $images[$i]
        $altZh = $altsZh[$i]
        $plainFlag = ""
        if ($img.PSObject.Properties.Name -contains 'plain' -and $img.plain) { $plainFlag = ", `"plain`": true" }
        $entries.Add("{`"src`": `"$(Esc-Js $img.src)`", `"alt`": `"$(Esc-Js $altZh)`"$plainFlag}")
    }
    $newImagesJs = "[" + ([string]::Join(", ", $entries)) + "]"

    $oldLine = [regex]::Match($text, "(?m)^const images = .+;$").Value
    $newLine = "const images = $newImagesJs;"
    $newText = $text.Replace($oldLine, $newLine)

    $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
    [System.IO.File]::WriteAllText($f.FullName, $newText, $utf8NoBom)
    $updated++
}

Write-Output "Updated files: $updated"
