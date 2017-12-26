# README #


From 2017-10-21 to 2017-11-23, I had the chance to cross the atlantic with my father and a friend on a sailboat. We were using [adrena](http://www.adrena.fr/en/) as navigation software. On top of all it's features, this program has the builtin functionality to log every minutes in a text file the following informations:

* **Location** (latitude and longitude)
* **Speed** (on ground)
* **Cap** (on ground)
* (true) **Wind speed**
* (true) **Wind orientation**

At the end of the trip, I retrieved this log file and back to my computer later, I filtered the time range into which we had sailed and reworked the data to make it digestible by the [Google Maps API](https://developers.google.com/maps/documentation/) and create a rather accurate (~43k data points) [route](https://pierreroudaut.github.io/transat-route/) of our journey.
