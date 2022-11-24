import React, { Component } from 'react';
import axios from 'axios';

import "../style/style.css";

class Home extends Component {

    state = {
        name: "circle",
        numberChoices: 0,
        restaurant_names: [
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
        ],
        restaurants: [],
        latitude: 0,
        longitude: 0,
    }

    getRandomIntIndexes = (quantity, max) => {
        const set = new Set()
        while(set.size < quantity) {
          set.add(Math.floor(Math.random() * max))
        }
        return set
    }

    spinWheel = () => {
        this.setState({
            name:"circle start-rotate"
        });
        setTimeout(() => {
            this.setState({
                name: "circle start-rotate stop-rotate"
            });
        }, Math.floor(Math.random() * 5000) + 1000);
    }

    componentDidMount = () => {
        this.getUserLocation();
    }

    addNewLine = (s) => {
        let tokens = s.split(" ");
        for(let i=2; i < tokens.length; i= i+2) {
            tokens[i] += "\n";
        }
        let newName = "";
        for(let i=0; i<tokens.length; i++) {
            newName += tokens[i] + ' ';
        }
        return newName;
    }

    renderWheel = (number) => {
        const restaurants = [];
        var numberString = "";
        switch(number){
            case 4: numberString = "four";
            break;
            case 6: numberString = "six";
            break;
            default: numberString = "";
            break;
        }
        for(var i=0; i<number; i++){
            restaurants[i] = i;
        }
        const restaurantNames = this.state.restaurant_names;
        for(let i=0; i<restaurantNames.length; i++) {
            restaurantNames[i] = this.addNewLine(restaurantNames[i]);
        }
        return(
            <ul className= {this.state.name}>
                {restaurants.map(restaurant => {
                    return(                    
                    <li className={numberString + " wheelLI"}>
                        <div className="text" 
                        id={numberString}
                        contentEditable="true" 
                        spellCheck="false">
                        {restaurantNames[restaurant].split ('\n').map ((item, i) => <p key={i}>{item}</p>)}
                        </div>
                    </li>)
                })}
            </ul>
        );
    }

    getRestaurantRating = (restaurant) => {
        if(restaurant.hasOwnProperty("rating")){
            if(restaurant.rating === 0)
                return "N/A";
            else 
                return restaurant.rating;
        }
        else
            return "N/A";
    }

    getRestaurantNumRatings = (restaurant) => {
        if(restaurant.hasOwnProperty("user_ratings_total")){
            if(restaurant.user_ratings_total === 0)
                return "N/A";
            else 
                return restaurant.user_ratings_total;
        }
        else
            return "N/A";
    }

    getRestaurantPriceLevel = (restaurant) => {
        if(restaurant.hasOwnProperty("price_level"))
            return restaurant.price_level;
        else
            return "N/A";
    }

    getRestaurantOpen = (restaurant) => {
        if(restaurant.hasOwnProperty("opening_hours")){
            if(restaurant.opening_hours.open_now)
                return "Yes";
            else
                return "No";
        }
        else {
            return "N/A";
        }
    }

    getRestaurantAddress = (restaurant) => {
        if(restaurant.hasOwnProperty("vicinity")){
            return restaurant.vicinity;
        }
        else {
            return "N/A";
        }
    }


    renderCards = () => {
        let restaurants = this.state.restaurants;
        return(
            <div>
                <h3 className="cardsBanner" >Restaurant Info</h3>
                {restaurants.map(restaurant => {
                    return(         
                    <ul className = "card">
                        <li key = {restaurant}>
                            <p className = "title">{restaurant.name}</p>
                        </li>
                        <li>
                            <p><b>Rating: </b>{this.getRestaurantRating(restaurant)}</p>
                        </li>
                        <li>
                            <p><b>Number of Ratings: </b>{this.getRestaurantNumRatings(restaurant)}</p>
                        </li>
                        <li>
                            <p><b>Price Level: </b>{this.getRestaurantPriceLevel(restaurant)}</p>
                        </li>
                        <li>
                            <p><b>Open Now: </b>{this.getRestaurantOpen(restaurant)}</p>
                        </li>
                        <li>
                            <p><b>Address: </b>{this.getRestaurantAddress(restaurant)}</p>
                        </li>
                    </ul>
                    )
                })}
            </div>
        );
    }

    handleSubmit = (event) => {
        event.preventDefault();
        let numChoices = document.getElementById("number-choices").value;
        let kw = document.getElementById("keyword").value;
        let maxDistanceStr = document.getElementById("radius").value;

        if(numChoices === "" || kw === "" || maxDistanceStr === ""){
            alert("Please Choose All of the Filters!");
            return;
        }

        
        let maxRadius = parseInt(maxDistanceStr);
        axios.post("http://localhost:5000/restaurants", {
            data: {
                latitude : this.state.latitude,
                longitude : this.state.longitude,
                radius: maxRadius,
                keyword: kw,
            }
        })
        .then((res) => {
            console.log(res);
            if(res.data.length === 0){
                alert("Try a different keyword!");
                return;
            }
            const randomRestaurantIndexesSet = this.getRandomIntIndexes(numChoices, res.data.length - 1);
            const randomRestaurantIndexes = Array.from(randomRestaurantIndexesSet);
            let restaurantNames = [];
            let restaurantObjects = [];
            for(let i=0; i<numChoices; i++){
                restaurantNames[i] = res.data[randomRestaurantIndexes[i]].name;
                restaurantObjects[i] = res.data[randomRestaurantIndexes[i]];
            }
            this.setState({
                numberChoices: parseInt(numChoices),
                restaurant_names : restaurantNames,
                restaurants : restaurantObjects
            })
            
        })
    }

    getUserLocation = () => {
        window.navigator.geolocation.getCurrentPosition(this.successLocation, console.log);
    }

    successLocation = (pos) => {
        this.setState({
            latitude : pos.coords.latitude,
            longitude : pos.coords.longitude,
        })
    }


    render(){
        return(
            <div>
                <div className="arrow"></div>
                {this.renderWheel(parseInt(this.state.numberChoices))}
                <button className="spin-button"
                onClick={this.spinWheel}>SPIN</button>
                <form onSubmit={this.handleSubmit}>
                    <select id="number-choices">
                        <option value="Select">Number of Candidates</option>
                        <option value="4">4</option>
                        <option value="6">6</option>
                    </select>
                    <select id="radius">
                        <option value="radius">Max Distance (Miles) </option>
                        <option value="2">2</option>
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="25">25</option>
                    </select>
                    <label>Keyword: </label>
                    <input id="keyword" type="text"></input>
                    <input id="submit" type = "submit" value="Submit"/>
                </form>
                {this.renderCards()}
            </div>
        );
    }
}

export default Home;