# flask packages
from ast import keyword
from flask import Flask, request
from flask import jsonify

from flask_cors import CORS, cross_origin

# pythons packages
import googlemaps # pip install googlemaps
import pandas as pd # pip install pandas
import time
import json
import requests

app = Flask(__name__)
CORS(app) #resources={r"/*": {"origins": "*"}}

# convert miles to meters
def miles_to_meters(miles):
    try:
        return miles * 1609.344
    except:
        return 0

def getGoogleAPIKey():
    # get api key from txt file
    fp = open("API_KEY.txt", 'r')
    api_key = fp.read()
    fp.close()
    return api_key

# default lon and lad is Austin,TX
def getGoogleRestaurants(keyword="pizza", lon=-97.743057, lat=30.267153, radius=1500):
    res = []
    api_key = getGoogleAPIKey()
    type = "restaurant"

    url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location={}%2C{}&radius={}&type={}&keyword={}&key={}".format(lat, lon, radius, type, keyword, api_key)

    payload={}
    headers = {}
    response = requests.request("GET", url, headers=headers, data=payload)

    return response.text


def getGooglePlaces():
    API_KEY = getGoogleAPIKey()
    map_client = googlemaps.Client(API_KEY)
    # tuple ex)37.43634534543543, -122.23432423432432
    # Austin, TX lat: 30.267153, lon: -97.743057

    latitude = 30.267153
    longitude = -97.743057
    location = (latitude, longitude)
    search_string = 'ramen'
    distance = miles_to_meters(15)
    business_list = []

    response = map_client.places_nearby(
        location = location,
        keyword=search_string,
        name='ramen shop',
        radius = distance,
    )

    business_list.extend(response.get('results'))
    next_page_token = response.get('next_page_token')

    while next_page_token:
        time.sleep(2)
        response = map_client.places_nearby(
        location = location,
        keyword=search_string,
        name='ramen shop',
        radius = distance,
        page_token = next_page_token,
        )
        business_list.extend(response.get('results'))
        next_page_token = response.get('next_page_token')

    df = pd.DataFrame(business_list)
    df['url'] = 'https://www.google.com/maps/place/?q=place_id:' + df['place_id']
    # df.to_excel('ramen shop list.xlsx', index=False)
    # res contains the response from Google API
    res = df.to_json(orient="index")
    parsed = json.loads(res)
    return parsed

@app.route("/", methods=['GET'])
def main():
    return "<h3> Backend server is running... </h3>"

@cross_origin()
@app.route("/test", methods=['POST'])
def getTest():
    params = json.loads(request.data)
    # print("1. params1: ", params['data'])
    keyword = params['data']['keyword']
    lon = float(params['data']['longitude'])
    lat = float(params['data']['latitude'])
    radius = int(params['data']['radius']) # in miles
    radius_in_meters = miles_to_meters(radius)
    # print("2. lon={}, lat={}".format(lon, lat))
    # print("3. keyword={}, radius={}".format(keyword, radius))

    # make it into json for returned param
    res = json.loads(getGoogleRestaurants(keyword, lon, lat, radius_in_meters))
    restaurants_names = []
    for rest in res['results']:
        # print("1. restaurant: ", rest['name'])
        restaurants_names.append(rest['name'])
        # print("2. attributes: ", set(rest.keys()), "\n")
    return jsonify(restaurants_names)

@cross_origin()
@app.route("/restaurants", methods=['POST'])
def getRestaurants():
    params = json.loads(request.data)
    keyword = params['data']['keyword']
    lon = float(params['data']['longitude'])
    lat = float(params['data']['latitude'])
    radius = int(params['data']['radius']) # in miles
    radius_in_meters = miles_to_meters(radius)

    # make it into json for returned param
    # res = json.loads(getGoogleRestaurants()) # testing purpose
    res = json.loads(getGoogleRestaurants(keyword, lon, lat, radius_in_meters))

    return jsonify(res['results'])


if __name__ == '__main__':
    app.run()