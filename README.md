# DinnerAndAMovie
****UPDATED****
Javascript code can be found in the results.js file. The views.py inside of
the homepage application handles the python logic. results.css has the styles
of the app. landingpage.html, restaruants.html, and theaters.html have the three
pages of the website. All these are also found in the homepage app.

*Description*
DinnerAndAMovie allows you to enter your location and see the movie theaters
nearby. Then, from the list of theaters, you can select the theater of your
choice to view nearby restaurants. Users can conveniently see quick facts on
restaurant/theater they are looking at such as address and yelp score, with a
quick link to the yelp page. Alongside the results, users can view the location
conveniently on a map to get an idea of location. Users have the option to sign
in and add theaters or restaurants to a list of favorites for quick access in
the future.

*Technologies*
I used the yelp API to get the restaurants/theaters.

I used the Django framework, primarily just to handle the form and backend API
call to Yelp.

I used Firebase to handle the backend database of the website, such as user
creation and storage of favorited restaurants/movies.

I used materialize to help with the styling.

*My Experience*

This project incorporated several web development components that I either had
very limited experience with, or have never used before. I have very limited
experience with APIs such as Yelp. I fought valiantly trying to figure out how
to call the Yelp API from the front end side using purely Javascript/jQuery
only to be defeated. I set out to do this project in React, but unfortunately, I
was having a really hard time getting things to work, with  my lack of
experience. So, I decided to use Django, using python only when necessary. I
considered using a proxy to help me call the Yelp API, but it felt
just a little bit too hacky for me and my limited experience. I had fun
exploring the Yelp API and learning how useful it could be. I also had no
experience with Google Firebase. My only backend database experience in web
development is with Postgres. Seeing this as an opportunity to learn another
method, I set out to understand Firebase and how to integrate it. I also have
absolutely no experience with any NoSQL solutions, so that was fun using. I
actually really really like Firebase and will probably use it again in the
future. Also, considering that this is predominantly a front end development
class, I implemented Firebase through front end API calls. On that note, I tried
to do as much as I could in the front end to demonstrate my new found ability to
utilize javascript. I already have a lot of experience in Django, so I really
didn't want to use it for much more than making the actual Yelp API requests.
For example, to display the user favorites on the homepage, I used javascript to
 cycle through the list of favorites from Firebase and dynamically add HTML to
the homepage. I did use a lot of jQuery, predominantly for its convenient
attribute selectors. Another example of something I did with Javascript that
would have been easier with Python was cleanly formatting the phone numbers for
the businesses.

*Future Improvements*
There are several things that I considered doing that didn't quite make it into
the final build due to time and scope concerns. I wanted to add HTML5
geolocation. I also wanted to add the ability for a user to share their plans
via text message or Facebook.
