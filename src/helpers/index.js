export const weekDay = (date) => {
  const day = date.split(',')[0]
  const datecalendar = date.split(',')[1]
  const daycalendar = datecalendar.split(' ')[1]
  const monthcalendar = datecalendar.split(' ')[2]
  const yearcalendar = datecalendar.split(' ')[3]

  return `${day} - ${daycalendar} ${monthcalendar} ${yearcalendar}`
}

export const secondsToHms = (d) => {
  d = Number(d)
  var h = Math.floor(d / 3600)
  var m = Math.floor((d % 3600) / 60)
  var s = Math.floor((d % 3600) % 60)

  var hDisplay = h > 0 ? h + (h == 1 ? 'hr ' : 'hrs ') : ''
  var mDisplay = m > 0 ? m + (m == 1 ? 'min' : 'mins') : ''
  var sDisplay = s > 0 ? s + (s == 1 ? 's' : 's') : ''
  return hDisplay + mDisplay
}
