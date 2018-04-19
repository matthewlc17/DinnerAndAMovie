const dinnermovie = (function () {

    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyD7wS9vGo_FUizl7QU-MNJTfCI7W_NKL5E",
        authDomain: "dinnerandamovie-5760e.firebaseapp.com",
        databaseURL: "https://dinnerandamovie-5760e.firebaseio.com",
        projectId: "dinnerandamovie-5760e",
        storageBucket: "dinnerandamovie-5760e.appspot.com",
        messagingSenderId: "383991887259"
    };
    firebase.initializeApp(config);
    var provider = new firebase.auth.GoogleAuthProvider();
    var firestore = firebase.firestore();
    var loginButton =  document.querySelector("#loginButton");
    var logoutButton = document.querySelector("#logoutButton");
    let restaurants = [];
    let theaters = [];

    let user;
    let mymarkers = [];
    firebase.auth().onAuthStateChanged(function(tempuser) {
        if (tempuser) {
            user = tempuser;
            console.log(user);
        }
    });

    function loginListener () {
        firebase.auth().signInWithPopup(provider).then(function(result) {
            user = result.user;
            console.log("user", user);
            record_user(user);
            checkUserState();
            // loginButton.style.display='none';
            // logoutButton.style.display='inline';
        });
    }
    function logoutListener (){
        firebase.auth().signOut().then(function() {
            checkUserState();
            // logoutButton.style.display='none';
            // loginButton.style.display='inline';
            // document.querySelector("#heading").innerHTML = 'General Conference Quotes';
            user={};
        }, function(error) {
            // An error happened.
            console.log(error);
        });
    }
    function record_user(user){
        firestore.collection("users").doc(user.uid).set({
            "name":user.displayName,
            "email":user.email,
            "photo":user.photoURL,
            "lastLogin":firebase.firestore.FieldValue.serverTimestamp()
        }).catch(function(error){
            // tag("msg").innerHTML='record_user: '+error;
            // tag("message").style.display="block";
            console.log('record_user: '+error);
        });
    }

    // function successfulLogin () {
    //     document.getElementById("loginButton").style.display='none';
    //     document.getElementById("logoutButton").style.display='inline';
    //     $("#username").html("Hello, " + user.displayName + "!");
    //     $(".star").attr("style", "display:block;")
    // }
    // function unsuccessfulLogin () {
    //     $("#username").html("");
    //     document.getElementById("logoutButton").style.display='none';
    //     document.getElementById("loginButton").style.display='inline';
    //     $(".star").attr("style", "display:none;");
    // }

    function checkUserState (callback) {
        firebase.auth().onAuthStateChanged(function(tempuser) {
            if (tempuser) {
                // User is signed in.
                document.getElementById("loginButton").style.display='none';
                document.getElementById("logoutButton").style.display='inline';
                $("#username").html("Hello, " + user.displayName + "!");
                if (typeof callback === "function") {
                    $(".star").attr("style", "display:block;")
                    firestore.collection("users").doc(user.uid).collection("restaurants").get().then(function(querySnapshot) {
                        querySnapshot.forEach(function(doc) {
                            restaurants.push(doc.id);
                        });
                        callback();
                    });
                    firestore.collection("users").doc(user.uid).collection("theaters").get().then(function(querySnapshot) {
                        querySnapshot.forEach(function(doc) {
                            theaters.push(doc.id);
                        });
                        callback();
                    });
                }
                return true;
            } else {
                // No user is signed in.
                $("#username").html("");
                document.getElementById("logoutButton").style.display='none';
                document.getElementById("loginButton").style.display='inline';
                $(".star").attr("style", "display:none;");
                return false;
            }
        });
    }

    function checkUserState2 () {
        firebase.auth().onAuthStateChanged(function(tempuser) {
            if (tempuser) {
                // callback();
                return true;
            } else {
                // No user is signed in.
                return false;
            }
        });
    }

    function delete_theater(yelp_id){
        firestore.collection("users").doc(user.uid).collection("theaters").doc(yelp_id).delete();
    }

    function delete_restaurant(yelp_id){
        firestore.collection("users").doc(user.uid).collection("restaurants").doc(yelp_id).delete();
    }

    function initMap() {
        let mylat = $('#business-1').data('lat');
        let mylon = $('#business-1').data('lon');
        let business_length = $('#business_list').data("length");
        let uluru = {lat: mylat, lng: mylon};
        map = new google.maps.Map(document.getElementById('map'), {
          zoom: 12,
          center: uluru
        });
        for (let i = 1; i <= business_length; i++) {
            let myID = '#' + 'business-' + i;
            let markerlat = $(myID).data('lat');
            let markerlon = $(myID).data('lon');
            let markername = $(myID).data('name');
            var marker = new google.maps.Marker({
                position: {lat: markerlat, lng: markerlon},
                map: map,
                animation: google.maps.Animation.DROP
            });
            mymarkers.push(marker);
            let phoneID = '#' + 'bus-phone-' + i;
            let phone = $(phoneID).text();
            phone = phone.slice(1,2) + " (" + phone.slice(2,5) + ") " + phone.slice(5,8) + "-" + phone.slice(8,12);
            $(phoneID).text(phone);
            let myheader = "#header-" + i;
            marker.addListener('click', function() {
                window.location.hash = myheader;
                $(myheader).click();

                // marker.setAnimation(google.maps.Animation.BOUNCE);
            });
            marker.addListener('mouseover', function() {
                $(myheader).attr("style", "background-color:#ffcdd2;");
                window.location.hash = myheader;
            });
            marker.addListener('mouseout', function() {
                $(myheader).attr("style", "");
            });
            let star_id = "#star-" + i;
            /******  WHEN A STAR IS HOVERD, CHANGE THE STAR TYPE DEPENDING ON ORIGINAL VALUE ******/
            $(star_id).hover(function () {
                if ($(this).data("full") === 0) {
                    $(this).attr("src", $(this).data("full_star"));
                } else if ($(this).data("full") === 1) {
                    $(this).attr("src", $(this).data("gray_star"));
                }
            },
            function () {
                if ($(this).data("full") === 0) {
                    $(this).attr("src", $(this).data("gray_star"));
                } else if ($(this).data("full") === 1) {
                    $(this).attr("src", $(this).data("full_star"));
                }
            });
            /******  WHEN A STAR IS CLICKED, SAVE THE RESTAURANT AS A FAVORITE, AND CHANGE STAR TYPE TO FULL STAR ******/
            $(star_id).click(function (event) {
                event.preventDefault();
                if ($(this).data("full") === 0) {
                    $(this).data("full", 1);
                    if ($(this).data("type") === "restaurant") {
                        save_restaurant($(this).data("yelp_id"), $(this).data("name"), $(this).data("address"), phone, $(this).data("rating"), $(this).data("image"));
                    } else if ($(this).data("type") === "theater") {
                        save_theater($(this).data("yelp_id"), $(this).data("name"), $(this).data("address"), phone, $(this).data("rating"), $(this).data("image"));
                    }
                } else if ($(this).data("full") === 1) {
                    $(this).data("full", 0);
                    if ($(this).data("type") === "restaurant") {
                        delete_restaurant($(this).data("yelp_id"));
                    } else if ($(this).data("type") === "theater") {
                        delete_theater($(this).data("yelp_id"));
                    }
                }
                return false;
            });
        }
        if (mymarkers.length > 1) {
            let latlng = [];
            mymarkers.forEach(function (marker) {
                latlng.push(new google.maps.LatLng(marker.position.lat(), marker.position.lng()));
            });
            let latlngbounds = new google.maps.LatLngBounds();
            latlng.forEach(function (myLatLng) {
                latlngbounds.extend(myLatLng);
            });
            map.fitBounds(latlngbounds);
        } else if (mymarkers.length === 1) {
            map.setZoom(11);
            map.panTo(gmMarkers[0].position);
        } else {
            map.setZoom(11);
            map.panTo(uluru);
        }
    }

    function save_restaurant(yelp_id, name, address, phone, rating, image){
        console.log("saving restaurant");
        var doc = firestore.collection("users").doc(user.uid).collection("restaurants").doc(yelp_id);
        doc.set({
            "yelp_id":yelp_id,
            "name":name,
            "address":address,
            "phone":phone,
            "rating":rating,
            "image":image
        });
    }

    function save_theater(yelp_id, name, address, phone, rating, image){
        console.log("saving theater");
        var doc = firestore.collection("users").doc(user.uid).collection("theaters").doc(yelp_id);
        doc.set({
            "yelp_id":yelp_id,
            "name":name,
            "address":address,
            "phone":phone,
            "rating":rating,
            "image":image
        });
    }

    function userStateCallback () {
        let business_length = $('#business_list').data("length");
        let yelp_array = [];
        for (let i = 1; i <= business_length; i++) {
            let star_id = "#star-" + i;
            let yelp_id = $(star_id).data("yelp_id");
            if (restaurants.includes(yelp_id)) {
                $(star_id).data("full", 1);
                $(star_id).attr("src", $(star_id).data("full_star"));
            } else if (theaters.includes(yelp_id)) {
                $(star_id).data("full", 1);
                $(star_id).attr("src", $(star_id).data("full_star"));
            }
        }
    }

    function handleStarClick() {
        $(this).attr("style", "width:100px;")
    }

    return {
        initMap : initMap,
        userStateCallback: userStateCallback,
        checkUserState: checkUserState,
        checkUserState2: checkUserState2,
        loginListener: loginListener,
        logoutListener: logoutListener,
        user: user,
        firestore: firestore,
        handleStarClick: handleStarClick,
        delete_restaurant: delete_restaurant,
        delete_theater: delete_theater,
        save_restaurant: save_restaurant,
        save_theater: save_theater
        // getFavorites: getFavorites
    };

}());
