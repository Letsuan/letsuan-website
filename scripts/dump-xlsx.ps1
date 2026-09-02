param(
    [Parameter(Mandatory=$true)][string]$XlsxPath,
    [Parameter(Mandatory=$true)][string]$OutDir
)
$ErrorActionPreference = 'Stop'

if (-not (Test-Path $OutDir)) { New-Item -ItemType Directory -Path $OutDir | Out-Null }

$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$excel.DisplayAlerts = $false
$wb = $excel.Workbooks.Open($XlsxPath, [Type]::Missing, $true)

foreach ($ws in $wb.Worksheets) {
    $name = $ws.Name
    $used = $ws.UsedRange
    $rows = $used.Rows.Count
    $cols = $used.Columns.Count
    $data = $used.Value2

    $safeName = ($name -replace '[\\/:*?"<>|]', '_')
    $outFile = Join-Path $OutDir "$safeName.csv"
    $sb = New-Object System.Text.StringBuilder

    for ($r = 1; $r -le $rows; $r++) {
        $lineParts = New-Object System.Collections.Generic.List[string]
        for ($c = 1; $c -le $cols; $c++) {
            $val = $null
            if ($rows -eq 1 -and $cols -eq 1) {
                $val = $data
            } elseif ($rows -eq 1) {
                $val = $data[1, $c]
            } elseif ($cols -eq 1) {
                $val = $data[$r, 1]
            } else {
                $val = $data[$r, $c]
            }
            if ($null -eq $val) { $val = "" }
            $s = [string]$val
            $s = $s -replace '"', '""'
            if ($s -match '[",\n]') { $s = '"' + $s + '"' }
            $lineParts.Add($s)
        }
        [void]$sb.AppendLine([string]::Join(",", $lineParts))
    }

    $utf8Bom = New-Object System.Text.UTF8Encoding($true)
    [System.IO.File]::WriteAllText($outFile, $sb.ToString(), $utf8Bom)
    Write-Output "Sheet '$name' -> $outFile ($rows x $cols)"
}

$wb.Close($false)
$excel.Quit()
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null
