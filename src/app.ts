import axios from 'axios'
import { exit, stdin, stdout } from 'process';
const prompt = require('prompt-sync')();
import WeatherDatabase from './db_handler';


var readline = require("readline")
const weatherURL: string = "http://api.weatherstack.com/current"

var ReadLine = readline.createInterface({
    input: stdin,
    output: stdout,
});

var requestParameters = { 
    "access_key": "dd4210b05cfe6d49c1c326ca1b5cbe2a",
    "query": ""
}

const main = async (args : Array<string>, argv: number ) => {
    
    const db = new WeatherDatabase();
    console.log(`api key : ${requestParameters.access_key}`);
    while (true)
    {

        requestParameters.query = userQuery();
        if (!CheckQuery(requestParameters.query))
        {
            break;
        }
        if (requestParameters.query.includes("GET"))
        {
            await db.GetQuery(requestParameters.query);
            continue;
        }
        var data = await WeatherRequest().then(
            async (res) => {
                console.log(res?.data);
                if (res?.status === axios.HttpStatusCode.Ok)
                {  
                    return res.data;
                }
                return {};
            }
        );
        if (Object.keys(data).length > 0)
        {
           await db.InsertQuery(`${JSON.stringify(data)}")`); 
        }
    }
    db.db.close();
    exit(0);
} 

const userQuery = () =>  {
    try {
        var query = prompt('What location?');
        console.log(`Your query is: ${query}`);
        return query;
    } catch (err) {
      console.error('query rejected', err);
    }
  }

const WeatherRequest = async () => {
    try {
        
        const response = await axios.get(weatherURL, {params: requestParameters});
        return response;
    } catch (error) {
       console.log(`error from request sent: ${error}`);
    }
} 

const CheckQuery = (query: any) => {
    if ( query ===  "^C"  || query === null)
    {
        return false;
    }
    else
    {
        return true;
    }
}

main([], 0);
