$ErrorActionPreference = 'Stop'
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
Add-Type -AssemblyName System.Drawing

$root     = 'C:\Users\Erdem\hurriyet-senatosu-landing'
$fontsDir = Join-Path $root 'assets\fonts'
$imgDir   = Join-Path $root 'assets\img'
$cssDir   = Join-Path $root 'assets\css'
New-Item -ItemType Directory -Force -Path $fontsDir, $imgDir, $cssDir | Out-Null

# ---------------------------------------------------------------
# 1) Self-hosted fonts: Montserrat (display) + Inter (body)
#    Downloads latin + latin-ext woff2 from Google Fonts, writes fonts.css
# ---------------------------------------------------------------
try {
  $ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36'
  $cssUrl = 'https://fonts.googleapis.com/css2?family=Inter:wght@400..800&family=Montserrat:wght@600..900&display=swap'
  $css = (Invoke-WebRequest -Uri $cssUrl -Headers @{ 'User-Agent' = $ua } -UseBasicParsing).Content

  $files = @{}
  $faces = New-Object System.Collections.Generic.List[string]
  foreach ($m in [regex]::Matches($css, '@font-face\s*\{[^}]*\}')) {
    $b    = $m.Value
    $fam  = [regex]::Match($b, "font-family:\s*'([^']+)'").Groups[1].Value
    $wght = [regex]::Match($b, 'font-weight:\s*([^;]+);').Groups[1].Value.Trim()
    $url  = [regex]::Match($b, 'url\((https://[^)]+?\.woff2)\)').Groups[1].Value
    $ur   = [regex]::Match($b, 'unicode-range:\s*([^;]+);').Groups[1].Value.Trim()
    if (-not ($fam -in @('Inter', 'Montserrat'))) { continue }
    $subset = $null
    if ($ur.StartsWith('U+0000')) { $subset = 'latin' }
    elseif ($ur.StartsWith('U+0100')) { $subset = 'latin-ext' }
    if (-not $subset) { continue }
    $slug = ($fam -replace ' ', '-').ToLower()
    $file = "$slug-$subset.woff2"
    $files[$file] = $url
    $faces.Add("@font-face{font-family:'$fam';font-style:normal;font-weight:$wght;font-display:swap;src:url('../fonts/$file') format('woff2');unicode-range:$ur;}")
  }
  foreach ($k in $files.Keys) {
    Invoke-WebRequest -Uri $files[$k] -OutFile (Join-Path $fontsDir $k) -UseBasicParsing
  }
  Set-Content -Path (Join-Path $cssDir 'fonts.css') -Value ($faces -join "`n") -Encoding UTF8
  Write-Output ('FONTS OK: ' + (($files.Keys | Sort-Object) -join ', '))
}
catch {
  Set-Content -Path (Join-Path $cssDir 'fonts.css') -Value '/* Self-hosted fonts could not be downloaded at build time; system font stack is used. */' -Encoding UTF8
  Write-Output ('FONTS FAIL (system stack fallback): ' + $_.Exception.Message)
}

# ---------------------------------------------------------------
# 2) VSL posteri (dikey 9:16): kaynak videonun ortasından kırpılan kare.
#    Kaynak video varsa ffmpeg ile 36. saniyeden 608x1080 (9:16) kare alınır.
#    Kaynak yoksa mevcut poster korunur (elle üretilmiş sürüm silinmez).
#    Not: --vsl-crop ile oynatıcı 9:16'ya kırpılır; gerçek dikey video gelince
#    poster de tam kare (ör. 1080x1920) olmalıdır.
# ---------------------------------------------------------------
$posterPath = Join-Path $imgDir 'vsl-poster.jpg'
$srcVideo   = 'C:\Users\Erdem\Desktop\vsl.mp4'
if ((Test-Path $srcVideo) -and (Get-Command ffmpeg -ErrorAction SilentlyContinue)) {
  & ffmpeg -y -loglevel error -ss 00:00:36 -i $srcVideo -frames:v 1 -vf 'crop=608:1080:656:0' -q:v 4 $posterPath
  Write-Output 'POSTER OK: videodan 9:16 kare (608x1080) üretildi'
} elseif (Test-Path $posterPath) {
  Write-Output 'POSTER SKIP: kaynak video yok; mevcut assets/img/vsl-poster.jpg korunuyor'
} else {
  Write-Output 'POSTER MISSING: ne kaynak video ne de assets/img/vsl-poster.jpg var'
}

# ---------------------------------------------------------------
# 3) HUR SENATOR badge — KAPALI
#    Sayfa bu rozeti kullanmıyor (ağaç/sembol vurgusu istendiği için kaldırıldı).
#    Tekrar gerekirse aşağıdaki bloğu aç:
# ---------------------------------------------------------------
# $badgeSrc = 'C:\Users\Erdem\Desktop\Group 20.png'
# if (Test-Path $badgeSrc) {
#   Copy-Item $badgeSrc (Join-Path $imgDir 'hur-senator.png') -Force
#   Write-Output 'BADGE OK: hur-senator.png kopyalandi'
# } else {
#   Write-Output 'BADGE MISSING: Group 20.png not found'
# }

Write-Output 'DONE'
