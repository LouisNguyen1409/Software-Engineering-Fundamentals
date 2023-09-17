## Weather

Copy the weather data from the class account.

```shell
$ cp ~cs1531/public_html/21T3/weatherAUS.csv ./
```

If you are working locally, you can run the following command (replace the zID with your own).

```shell
$ scp -O z5313514@cse.unsw.edu.au:~cs1531/public_html/practice_activity/weatherAUS.csv weatherAUS.csv
```

Or download from the link
- http://cgi.cse.unsw.edu.au/~cs1531/practice_activity/weatherAUS.csv

To complete this lab, you are recommended to use a library to parse csv files.

In [weather.js](weather.js), complete the function `weather` which takes two arguments:
 1. A date in the format "DD-MM-YYYY"
 2. The name of a location e.g. "Albury"

It returns an array with two elements `[A, B]` where `A` is the value of how far the minimum temperature is below the average minimum across all time, for that given day, and `B` is the value of how far the maximum temperature is above the average maximum across all time, for that given day.

If an invalid (or empty) date or town is entered, the function should simply return `[null, null]`.

For example, if the MinTemp and MaxTemp of 'Albury' on '08-08-2010' is -1.3 and 12.6 respectively, and the average minimum and average maximum temperature of Albury over the entire data set are 9.5 and 22.6, the function would return `[10.8, 10.0]`

Any values in the table that are "NA" or any other invalid number do not need to be counted.

Write tests in `weather.test.js`.

TIP: 
1. Make sure to compare the date format of the csv to the date format given to the `weather` function.

2. We recommend using the package [csv-load-sync](https://www.npmjs.com/package/csv-load-sync).