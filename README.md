## Hot Desk readme

#### Introduction:

HotDesk is a full-stack, express application designed for employees to book
desks in flexible office locations provided by their employer. I chose this
project as an example of an application required in today’s hybrid-model working
world, where employees split their time between office and home working. The app
is built predominantly with node.js, express, mongoose, mongoDB and EJS.

The main features of the application are as follows:

Users are able to register for two types of accounts: employer and employees.
The registration of both types of users is handled by passport.js.

#### Employer Functions:

- Employers are able to add as many offices as required. When registering an
  office, users are prompted to add: office name, address, a floorplan image,
  and to select the number of bookable desks. Using the mapbox geocoding
  service, the address will be forward-geocoded to provide latitude and
  longitude co-ordinates, to show the office location on a mapbox map.

- All office data can be edited at any time, including increasing/decreasing the
  number of desks – if the number of desks is reduced, all relevant data is
  removed from the database such as bookings on removed desks.

- Before being stored on the database, a salt is added to the passcode and then
  hashed using bcrypt to prevent any unwanted users from being able to register
  with a company information from the database is compromised.

- Employers are also given access to an admin page that provides information on
  all registered users of a company, and all bookings across all offices,
  including username. From this page, admins can nominate additional employees
  to be granted admin permissions, providing nominee access to the admin panel,
  and the ability to change other user permissions, add, edit and delete
  offices, and edit and delete the company. Admin users cannot change their own
  status, or delete their own accounts, ensuring that a company is not be left
  without at least one admin user.

#### Employee Functions:

- When an employee signs up, they must provide the correct company code and
  passcode before being able to successfully register. Once registered, users
  are directed to their company page, where offices are listed.

- When viewing an office, employees are able to select a desk, a date and a
  session (AM or PM) and make a booking, or delete previous bookings. There are
  both a client-side scripts and server-side middleware to ensure that a desk
  cannot be double booked, even if forced through with an application such as
  postman.

- Employees are able to view all bookings made for an office, however they
  cannot see who has booked them, and can only delete bookings made by
  themselves. There is also a ‘my bookings’ page that lists all bookings an
  employee has made across all sites.

#### General Functionality:

To avoid storing unnecessary data, the package cron is used to run a function
that deletes old bookings each night at midnight. The function deletes any
bookings more than three days out of date. I have elected to keep bookings for
three days post their booking date for employee convenience, for such times when
employees need to recollect where they have worked i.e. for lost property etc.

#### My Biggest Learnings:

The biggest flaw in my app is that bookings do not display in chronological
order. After trying myriad mongoose methods to sort the data as it is passed
from the database, and further researching the issue, I discovered this is a
longstanding known bug in mongoose.

As I had used the populate method to request subdocuments from the office
document, they cannot be sorted using the mongoose sort method because of
previous issues with data fields being crossed upon sorting.

Because bookings are likely to be made in the near future only, the
non-chronological display of bookings is an annoying issue, but not a
functionally detrimental one. I considered limiting bookings so that a desk can
only be booked 7 days in advance to minimise the list of non-chronological
dates, but decided against it because I believe users prefer a less restrictive
experience.

#### Future Improvements:

Whilst the application is functional and finished (for now!), there are
additional features I would like to add to enhance useability,as follows:

1. To allow further flexibility with booking desks, I would change the AM/PM
   booking system to a start/finish time style. This would enable more than two
   bookings per desk per day and would be especially useful for offices that are
   in use 24-hours.

2. The ability to book meeting rooms in addition to desks, also with
   start/finish time functionality.

3. From a security perspective, a beneficial and necessary feature for
   production use would be the ability to change a company passcode. This could
   be taken one step further, with an inbuilt requirement that the company
   passcode be changed at least every 90 days.
