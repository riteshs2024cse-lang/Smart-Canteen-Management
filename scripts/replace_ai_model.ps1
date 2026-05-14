Set-Location -LiteralPath 'c:\Users\Ritesh''s victus\Downloads\Smart-canteen-management'
Get-ChildItem -Recurse -Include *.md,*.sh,*.bat,*.js,*.ps1 -File | ForEach-Object {
  $p = $_.FullName
  (Get-Content -LiteralPath $p) -replace 'AI-model','ai-model' | Set-Content -LiteralPath $p
}
Write-Host "Replacement of 'AI-model' -> 'ai-model' completed."
