# toggl-report
Export time entries from Toggl service to CSV

I use [Toggl](https://toggl.com) to keep track of my time on projects. The
service is pretty decent, but only includes a pathetically limited CSV
export (export totals for each task in a given time range).

In order to get actual time entries out of their system, you must use their
API. Here's a node script that does that.

## Usage
There is no API, sorry.

Create `config.js` as follows:
```
module.exports = {
  AUTHORIZATION_HEADER: "Basic #####################################"
}
```
...where characters after basic are derived from inspecting XHR requests made
by the toggl web frontend. It's basically just your access token base64
encoded but I forget the format and I'm lazy.

Then edit `getCSV.js` to include the project ID `pid`, also from toggl
interface. Edit `startDate` and `endDate` to whatever you want, as long as
the js Date constructor understands it.

Then run script. Yay.
