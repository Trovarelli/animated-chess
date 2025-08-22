export const GetNegativeColor = (
  color: 'white' | 'black' | null,
): 'white' | 'black' | null => {
  if (color === 'white') return 'black'
  if (color === 'black') return 'white'
  return null
}