import json
from bottle import Bottle, run, static_file, redirect, request, error
import sys
#import unirest
import xmltodict, json
import urllib.request


def gemig():
    print("Laddar in data fran systembolaget")    
    resp = urllib.request.urlopen("http://www.systembolaget.se/Assortment.aspx?Format=Xml").read() 
    val = xmltodict.parse(resp,encoding='utf-8')
    val = json.dumps(val)    
    return val
	
data = gemig()
#data = ""
activeusers = []

app = Bottle()
print("klar")

@app.route('/')
def send_static_main():
    return static_file('index.html', root='./web')

@app.route('/getdata', method='GET')
def getAllApps():
	global data
	return data

# route for handling the login page logic
@app.route('/login', method='POST')
def login():
    error = None
    global activeusers
    print(request.forms.get('username'))
    if request.method == 'POST':
    	#print(request)
        if request.forms.get('username') == 'admin' and request.forms.get('password') == 'admin':
            #error = 'Invalid Credentials. Please try again.'
            if request.forms.get('username') in activeusers:
            	return "finns redan"
            else:
            	activeusers.append(request.forms.get('username'))
            return "true"
       	else:
            return "false"
    return "false"

@app.route('/web/<filepath:path>')
def server_static(filepath):
    return static_file(filepath, root='./web')

@app.route('/resources/<filepath:path>')
def server_static(filepath):
    return static_file(filepath, root='./resources')

@app.route('/search')
def send_static_main():
    return static_file('search/search.html', root='./web')


run(app, host='localhost', port=1337)


print("Goodbye")


