Add-Type -AssemblyName System.Drawing

function New-RoundedRectangle([single]$x, [single]$y, [single]$width, [single]$height, [single]$radius) {
  $path = [System.Drawing.Drawing2D.GraphicsPath]::new()
  $diameter = $radius * 2
  $path.AddArc($x, $y, $diameter, $diameter, 180, 90)
  $path.AddArc($x + $width - $diameter, $y, $diameter, $diameter, 270, 90)
  $path.AddArc($x + $width - $diameter, $y + $height - $diameter, $diameter, $diameter, 0, 90)
  $path.AddArc($x, $y + $height - $diameter, $diameter, $diameter, 90, 90)
  $path.CloseFigure()
  return $path
}

$sizes = @(72, 96, 128, 144, 152, 192, 384, 512)
$target = Join-Path $PSScriptRoot '..\public\icons'
New-Item -ItemType Directory -Force -Path $target | Out-Null
$teal = [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml('#087c75'))
$white = [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml('#ffffff'))
$pale = [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml('#dff3ee'))

foreach ($size in $sizes) {
  $bitmap = [System.Drawing.Bitmap]::new($size, $size)
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $graphics.Clear([System.Drawing.ColorTranslator]::FromHtml('#087c75'))
  $graphics.ScaleTransform($size / 512, $size / 512)
  $body = New-RoundedRectangle 142 100 228 312 26
  $screen = New-RoundedRectangle 169 130 174 82 12
  $graphics.FillPath($white, $body)
  $graphics.FillPath($pale, $screen)
  foreach ($y in @(260, 326, 392)) {
    foreach ($x in @(186, 256, 326)) {
      $graphics.FillEllipse($teal, $x - 17, $y - 17, 34, 34)
    }
  }
  $graphics.FillRectangle($teal, 208, 163, 96, 13)
  $graphics.FillRectangle($teal, 293, 148, 11, 42)
  $path = Join-Path $target "icon-${size}x${size}.png"
  $bitmap.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
  $screen.Dispose(); $body.Dispose(); $graphics.Dispose(); $bitmap.Dispose()
}

$teal.Dispose(); $white.Dispose(); $pale.Dispose()
