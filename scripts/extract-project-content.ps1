param(
    [Parameter(Mandatory=$true)][string]$RootDir
)
$ErrorActionPreference = 'Stop'
$root = $RootDir
$pagesDir = Join-Path $root "astro\src\pages"
$zhBackupPath = Join-Path $root "content-zh-backup.json"

$zhBackup = Get-Content $zhBackupPath -Raw -Encoding UTF8 | ConvertFrom-Json

$rows = New-Object System.Collections.Generic.List[object]

$projectFiles = Get-ChildItem $pagesDir -Filter "project-*.astro" | Sort-Object Name

foreach ($file in $projectFiles) {
    $pageKey = $file.BaseName
    $htmlKey = "$pageKey.html"
    $zh = $null
    if ($zhBackup.PSObject.Properties.Name -contains $htmlKey) {
        $zh = $zhBackup.$htmlKey
    }

    $text = Get-Content $file.FullName -Raw -Encoding UTF8

    function Get-ConstValue($name, $text) {
        $m = [regex]::Match($text, "(?m)^const $name = (.+);$")
        if ($m.Success) { return $m.Groups[1].Value }
        return $null
    }

    $title = Get-ConstValue "title" $text
    $description = Get-ConstValue "description" $text
    $eyebrowLeft = Get-ConstValue "eyebrowLeft" $text
    $eyebrowRight = Get-ConstValue "eyebrowRight" $text
    $h1Main = Get-ConstValue "h1Main" $text
    $h1Sub = Get-ConstValue "h1Sub" $text
    $metaFieldsRaw = Get-ConstValue "metaFields" $text
    $bodyHtmlRaw = Get-ConstValue "bodyHtml" $text
    $imagesRaw = Get-ConstValue "images" $text

    function ParseJsonStr($raw) {
        if ($null -eq $raw) { return $null }
        try { return ($raw | ConvertFrom-Json) } catch { return $raw }
    }

    $titleV = ParseJsonStr $title
    $descV = ParseJsonStr $description
    $eyebrowLeftV = ParseJsonStr $eyebrowLeft
    $eyebrowRightV = ParseJsonStr $eyebrowRight
    $h1MainV = ParseJsonStr $h1Main
    $h1SubV = ParseJsonStr $h1Sub
    $metaFieldsV = ParseJsonStr $metaFieldsRaw
    $bodyHtmlV = ParseJsonStr $bodyHtmlRaw
    $imagesV = ParseJsonStr $imagesRaw

    $rows.Add([PSCustomObject]@{ Page=$pageKey; Field="Meta Title"; English=$titleV; Chinese=""; Note="Browser tab title (SEO)" })
    $rows.Add([PSCustomObject]@{ Page=$pageKey; Field="Meta Description"; English=$descV; Chinese=""; Note="SEO description" })
    $rows.Add([PSCustomObject]@{ Page=$pageKey; Field="Eyebrow Left"; English=$eyebrowLeftV; Chinese=$(if($zh){$zh."HEADER LINE"}else{""}); Note="Small label top-left" })
    $rows.Add([PSCustomObject]@{ Page=$pageKey; Field="Eyebrow Right"; English=$eyebrowRightV; Chinese=""; Note="Small label top-right" })
    $rows.Add([PSCustomObject]@{ Page=$pageKey; Field="H1 Main"; English=$h1MainV; Chinese=$(if($zh){$zh.Title}else{""}); Note="Main headline" })
    $rows.Add([PSCustomObject]@{ Page=$pageKey; Field="H1 Sub"; English=$h1SubV; Chinese=$(if($zh){$zh.Subtitle}else{""}); Note="Subheadline" })

    if ($metaFieldsV) {
        foreach ($f in $metaFieldsV) {
            $zhVal = ""
            if ($zh) {
                switch ($f.label) {
                    "CLIENT" { $zhVal = $zh.CLIENT }
                    "LOCATION" { $zhVal = $zh.LOCATION }
                    "YEAR" { $zhVal = $zh.YEAR }
                    "CATEGORY" { $zhVal = $zh.CATEGORY }
                    "AREA" { $zhVal = "" }
                }
            }
            $rows.Add([PSCustomObject]@{ Page=$pageKey; Field="Meta: $($f.label)"; English=$f.value; Chinese=$zhVal; Note="Spec field" })
        }
    }

    if ($bodyHtmlV) {
        $rows.Add([PSCustomObject]@{ Page=$pageKey; Field="Body (full HTML)"; English=$bodyHtmlV; Chinese=$(if($zh){$zh.Body}else{""}); Note="Full body copy (has HTML tags)" })
    }

    if ($imagesV) {
        $i = 1
        foreach ($img in $imagesV) {
            $rows.Add([PSCustomObject]@{ Page=$pageKey; Field="Image Alt $i ($($img.src))"; English=$img.alt; Chinese=""; Note="Image alt text" })
            $i++
        }
    }
}

$outPath = Join-Path $root "content-zh-review.csv"
$rows | Export-Csv -Path $outPath -NoTypeInformation -Encoding UTF8
Write-Output "Rows: $($rows.Count)"
Write-Output "Saved: $outPath"
