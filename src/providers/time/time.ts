import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

/*
  Generated class for the TimeProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class TimeProvider {

  constructor(public http: HttpClient, public translate: TranslateService) {
    console.log('Hello TimeProvider Provider');
  }

  checkOnline(time){
    time /= 1000;
    var timeNow = new Date().getTime() / 1000;
    console.log(time + " " + timeNow)
    var time_elapsed = timeNow - time;
    var seconds = Math.round(time_elapsed);
    return seconds;
  }

  getTime(time_ago) {
    setTimeout("", 10000);
    time_ago /= 1000;
    var timeNow = new Date().getTime() / 1000;
    console.log(time_ago + " " + timeNow)
    var time_elapsed = timeNow - time_ago;
    var seconds = Math.round(time_elapsed);
    var minutes = Math.round(time_elapsed / 60);
    var hours = Math.round(time_elapsed / 3600);
    var days = Math.round(time_elapsed / 86400);
    var weeks = Math.round(time_elapsed / 604800);
    var months = Math.round(time_elapsed / 2600640);
    var years = Math.round(time_elapsed / 31207680);
    // console.log(days);
    var result = {
      number: 0,
      'format': ''
    };
    if (seconds <= 60) {
      result.number = seconds;
      result['format'] = "seconds";
    }
    //Minutes
    else if (minutes <= 60) {
      if (minutes == 1) {
        result['number'] = 1;
        result['format'] = "minutes";

      }
      else {
        result['number'] = minutes;
        result['format'] = "minutes";
      }
    }
    //Hours
    else if (hours <= 24) {
      if (hours == 1) {
        result['number'] = 1;
        result['format'] = "hours";
      } else {
        result['number'] = hours;
        result['format'] = "hours";
      }
    }
    //Days
    else if (days <= 7) {
      if (days == 1) {
        result['number'] = 1;
        result['format'] = "days";
      } else {
        result['number'] = days;
        result['format'] = "days";
      }
    }
    //Weeks
    else if (weeks <= 4.3) {
      if (weeks == 1) {
        result['number'] = 1;
        result['format'] = "weeks";
      } else {
        result['number'] = weeks;
        result['format'] = "weeks";
      }
    }
    //Months
    else if (months <= 12) {
      if (months == 1) {
        result['number'] = 1;
        result['format'] = "months";
      } else {
        result['number'] = months;
        result['format'] = "months";
      }
    }
    //Years
    else {
      if (years == 1) {
        result['number'] = 1;
        result['format'] = "years";
      } else {
        result['number'] = years;
        result['format'] = "years";
      }
    }
    let format, ago
    this.translate.get(result['format']).subscribe(value => { format = value; })
    this.translate.get('ago').subscribe(value => { ago = value; })

    var arabic = /[\u0600-\u06FF]/;
    if (arabic.test(format)) {
      return ago + " " + result['number'] + " " + format;
    } else {
      return result['number'] + " " + format + " " + ago;
    }
  }
}
