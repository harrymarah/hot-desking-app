const deskSelector = document.querySelector('#deskSelector')
const amBtn = document.querySelector('#am-booking')
const pmBtn = document.querySelector('#pm-booking')
const amLabel = document.querySelector('#am-label')
const pmLabel = document.querySelector('#pm-label')
const datePicker = document.querySelector('#date-picker')
const bookingForm = document.querySelector('#booking-form') 
const checkboxDiv = document.querySelector('#am-pm-checkboxes')


const doubleBookingCheck = () => {
const deskNo = deskSelector.value
if(!deskNo) return
const bookings = office.desks[deskNo].bookings
const date = new Date(datePicker.value)
amBtn.disabled = false
pmBtn.disabled = false
amLabel.classList.replace('btn-secondary', 'btn-outline-primary')
pmLabel.classList.replace('btn-secondary', 'btn-outline-primary')
for(let booking of bookings){
    let bookingDate = new Date(booking.bookingDate)
    if(bookingDate.toString() === date.toString() && booking.bookedAM){
    amLabel.classList.replace('btn-outline-primary', 'btn-secondary')
    amBtn.disabled = true
    } 
    if(bookingDate.toString() === date.toString() && booking.bookedPM){
    pmBtn.disabled = true
    pmLabel.classList.replace('btn-outline-primary', 'btn-secondary')
    }
}
}

deskSelector.addEventListener('change', doubleBookingCheck)
datePicker.addEventListener('change', doubleBookingCheck)

bookingForm.addEventListener('submit', e => {
  e.preventDefault()
  if(!amBtn.checked && !pmBtn.checked){
    const msg = document.createElement('div')
    msg.innerHTML = '<p class="text-danger py-1"><small>You must select either a morning or afternoon session.</small></p>'
    checkboxDiv.appendChild(msg)
    amLabel.classList.replace('btn-outline-primary', 'btn-outline-danger')
    pmLabel.classList.replace('btn-outline-primary', 'btn-outline-danger')
    } else {
    bookingForm.submit()
  }
})